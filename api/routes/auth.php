<?php
declare(strict_types=1);

/**
 * Autentifikacijos maršrutai:
 *   GET  auth/me        - kas prisijungęs (user arba null)
 *   POST auth/register  - registracija (tik universiteto paštas)
 *   POST auth/login     - prisijungimas
 *   POST auth/logout    - atsijungimas
 */

function route_auth_me(): never
{
    json_response(['ok' => true, 'user' => current_user()]);
}

function route_auth_register(): never
{
    $body = read_json_body();
    $vardas   = body_string($body, 'vardas');
    $pavarde  = body_string($body, 'pavarde');
    $email    = mb_strtolower(body_string($body, 'el_pastas'));
    $password = is_string($body['slaptazodis'] ?? null) ? $body['slaptazodis'] : '';

    // --- Validacija (tie patys tekstai rodomi vartotojui) ---
    $namePattern = "/^[\\p{L}][\\p{L}\\p{M}\\s'’.-]*$/u";

    if ($vardas === '') {
        json_error('Prašome įvesti vardą.', 400, 'vardas');
    }
    if (mb_strlen($vardas) > 50 || preg_match($namePattern, $vardas) !== 1) {
        json_error('Vardas gali būti sudarytas tik iš raidžių (iki 50 simbolių).', 400, 'vardas');
    }
    if ($pavarde === '') {
        json_error('Prašome įvesti pavardę.', 400, 'pavarde');
    }
    if (mb_strlen($pavarde) > 50 || preg_match($namePattern, $pavarde) !== 1) {
        json_error('Pavardė gali būti sudaryta tik iš raidžių (iki 50 simbolių).', 400, 'pavarde');
    }
    if ($email === '') {
        json_error('Prašome įvesti el. pašto adresą.', 400, 'el_pastas');
    }
    if (strlen($email) > 100 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        json_error('Neteisingas el. pašto adreso formatas.', 400, 'el_pastas');
    }
    if (!is_university_email($email)) {
        json_error(
            'Registracija galima tik su universiteto el. paštu (@vilniustech.lt arba @stud.vilniustech.lt).',
            400,
            'el_pastas'
        );
    }
    if ($password === '') {
        json_error('Prašome įvesti slaptažodį.', 400, 'slaptazodis');
    }
    if (mb_strlen($password) < MIN_PASSWORD_LENGTH) {
        json_error('Slaptažodį turi sudaryti bent ' . MIN_PASSWORD_LENGTH . ' simboliai.', 400, 'slaptazodis');
    }
    if (strlen($password) > MAX_PASSWORD_BYTES) {
        json_error('Slaptažodis per ilgas (daugiausia ' . MAX_PASSWORD_BYTES . ' baitai).', 400, 'slaptazodis');
    }

    $pdo = getDbConnection();

    // --- Ar el. paštas laisvas? ---
    $stmt = $pdo->prepare('SELECT 1 FROM vartotojai WHERE el_pastas = ?');
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() !== false) {
        json_error('Paskyra su šiuo el. paštu jau egzistuoja. Prisijunkite.', 409, 'el_pastas');
    }

    // --- Rolė "Vartotojas" ---
    $stmt = $pdo->prepare('SELECT role_id FROM roles WHERE pavadinimas = ?');
    $stmt->execute([ROLE_USER]);
    $roleId = $stmt->fetchColumn();
    if ($roleId === false) {
        error_log('BookIT: lentelėje roles nerasta rolė "' . ROLE_USER . '"');
        json_error('Serverio nustatymų klaida. Kreipkitės į administratorių.', 500);
    }

    // --- Sukuriame paskyrą ---
    try {
        $stmt = $pdo->prepare(
            'INSERT INTO vartotojai (vardas, pavarde, el_pastas, slaptazodzio_hash, role_id, reg_data)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $vardas,
            $pavarde,
            $email,
            password_hash($password, PASSWORD_DEFAULT),
            (int) $roleId,
            date('Y-m-d'),
        ]);
    } catch (PDOException $e) {
        // Dvi registracijos tuo pačiu metu su tuo pačiu paštu (UNIQUE raktas).
        if ($e->getCode() === '23000') {
            json_error('Paskyra su šiuo el. paštu jau egzistuoja. Prisijunkite.', 409, 'el_pastas');
        }
        throw $e;
    }

    $userId = (int) $pdo->lastInsertId();
    login_user($userId, false);

    json_response(['ok' => true, 'user' => current_user()], 201);
}

function route_auth_login(): never
{
    $body = read_json_body();
    $email    = mb_strtolower(body_string($body, 'el_pastas'));
    $password = is_string($body['slaptazodis'] ?? null) ? $body['slaptazodis'] : '';
    $remember = ($body['prisiminti'] ?? false) === true;

    if ($email === '' && $password === '') {
        json_error('Prašome įvesti el. paštą ir slaptažodį!', 400);
    }
    if ($email === '') {
        json_error('Prašome įvesti el. paštą!', 400, 'el_pastas');
    }
    if ($password === '') {
        json_error('Prašome įvesti slaptažodį!', 400, 'slaptazodis');
    }
    if (strlen($email) > 100 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        json_error('Neteisingas el. pašto adreso formatas.', 400, 'el_pastas');
    }

    $stmt = getDbConnection()->prepare(
        'SELECT vartotojo_id, slaptazodzio_hash, uzblokuotas FROM vartotojai WHERE el_pastas = ?'
    );
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if (!$row) {
        // Paskyros nėra. Tekstas priklauso nuo problemos (NFR04).
        if (!is_university_email($email)) {
            json_error('Įvestas neuniversitetinis el. pašto adresas, prieiga negalima.', 403, 'el_pastas');
        }
        json_error('Paskyra su šiuo el. paštu nerasta. Prašome užsiregistruoti.', 401, 'el_pastas');
    }

    if (!password_verify($password, $row['slaptazodzio_hash'])) {
        usleep(250000); // šiek tiek sulėtina slaptažodžių spėliojimą
        json_error('Neteisingas slaptažodis.', 401, 'slaptazodis');
    }

    if ((int) $row['uzblokuotas'] === 1) {
        json_error('Ši paskyra užblokuota. Kreipkitės į bibliotekos administratorių.', 403);
    }

    // Jei PHP vėliau pakeis numatytąjį algoritmą, hash atsinaujins savaime.
    if (password_needs_rehash($row['slaptazodzio_hash'], PASSWORD_DEFAULT)) {
        $stmt = getDbConnection()->prepare('UPDATE vartotojai SET slaptazodzio_hash = ? WHERE vartotojo_id = ?');
        $stmt->execute([password_hash($password, PASSWORD_DEFAULT), (int) $row['vartotojo_id']]);
    }

    login_user((int) $row['vartotojo_id'], $remember);

    json_response(['ok' => true, 'user' => current_user()]);
}

function route_auth_logout(): never
{
    read_json_body(); // tik patikrina Content-Type (CSRF apsauga)
    logout_user();
    json_response(['ok' => true]);
}
