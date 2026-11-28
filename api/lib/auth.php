<?php
declare(strict_types=1);

/**
 * Sesijos ir prisijungusio vartotojo valdymas.
 *
 * Prisijungimas laikomas PHP sesijoje ($_SESSION['uid']). Naršyklė gauna tik
 * HttpOnly slapuką su sesijos ID (JavaScript jo nemato), slaptažodžiai niekur
 * nesaugomi atviru tekstu - DB yra tik password_hash() rezultatas (NFR15).
 */

const REMEMBER_COOKIE = 'bookit_remember';
const REMEMBER_SECONDS = 30 * 24 * 60 * 60; // "Prisimink mane" - 30 dienų

/** Paleidžia sesiją (saugu kviesti kelis kartus). */
function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    // Be šito PHP sesijas ištrintų po ~24 min. neaktyvumo.
    ini_set('session.gc_maxlifetime', (string) REMEMBER_SECONDS);

    // Jei vartotojas prisijungė su "Prisimink mane", sesijos slapukas galioja
    // 30 d., kitaip - kol uždaroma naršyklė.
    $lifetime = isset($_COOKIE[REMEMBER_COOKIE]) ? REMEMBER_SECONDS : 0;

    session_name('BOOKITSESSID');
    session_set_cookie_params([
        'lifetime' => $lifetime,
        'path'     => '/',
        'httponly' => true,
        'secure'   => is_https(),
        'samesite' => 'Lax',
    ]);
    session_start();
}

/** Slapuko parametrai (naudojami rankiniam slapukų siuntimui). */
function cookie_options(int $expires): array
{
    return [
        'expires'  => $expires,
        'path'     => '/',
        'httponly' => true,
        'secure'   => is_https(),
        'samesite' => 'Lax',
    ];
}

/**
 * Prijungia vartotoją: sukuria naują sesijos ID (apsauga nuo session fixation)
 * ir įrašo vartotojo ID į sesiją.
 */
function login_user(int $userId, bool $remember): void
{
    start_session();
    session_regenerate_id(true);
    $_SESSION['uid'] = $userId;

    if ($remember) {
        $expires = time() + REMEMBER_SECONDS;
        setcookie(REMEMBER_COOKIE, '1', cookie_options($expires));
        // Perrašome sesijos slapuką, kad jis galiotų 30 dienų.
        setcookie(session_name(), session_id(), cookie_options($expires));
    } else {
        setcookie(REMEMBER_COOKIE, '', cookie_options(time() - 3600));
    }
}

/** Atjungia vartotoją ir sunaikina sesiją. */
function logout_user(): void
{
    start_session();
    $_SESSION = [];
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
    setcookie(session_name(), '', cookie_options(time() - 3600));
    setcookie(REMEMBER_COOKIE, '', cookie_options(time() - 3600));
}

/** Vartotojo duomenys, kuriuos galima siųsti į naršyklę (be slaptažodžio hash). */
function public_user(array $row): array
{
    return [
        'id'       => (int) $row['vartotojo_id'],
        'vardas'   => $row['vardas'],
        'pavarde'  => $row['pavarde'],
        'el_pastas' => $row['el_pastas'],
        'role'     => $row['role'],
        'is_admin' => $row['role'] === ROLE_ADMIN,
    ];
}

/**
 * Grąžina prisijungusį vartotoją arba null.
 * Duomenys kaskart paimami iš DB, todėl rolės pakeitimas ar užblokavimas
 * įsigalioja iškart.
 */
function current_user(): ?array
{
    start_session();
    $userId = $_SESSION['uid'] ?? null;
    if (!is_int($userId)) {
        return null;
    }

    $stmt = getDbConnection()->prepare(
        'SELECT v.vartotojo_id, v.vardas, v.pavarde, v.el_pastas, v.uzblokuotas,
                r.pavadinimas AS role
           FROM vartotojai v
           JOIN roles r ON r.role_id = v.role_id
          WHERE v.vartotojo_id = ?'
    );
    $stmt->execute([$userId]);
    $row = $stmt->fetch();

    if (!$row || (int) $row['uzblokuotas'] === 1) {
        logout_user();
        return null;
    }
    return public_user($row);
}

/** Reikalauja prisijungimo (kitiems etapams: rezervacijos ir pan.). */
function require_login(): array
{
    $user = current_user();
    if ($user === null) {
        json_error('Šiai funkcijai reikia prisijungti.', 401);
    }
    return $user;
}

/** Reikalauja administratoriaus teisių (admin panelei). */
function require_admin(): array
{
    $user = require_login();
    if (!$user['is_admin']) {
        json_error('Neturite teisių peržiūrėti šio puslapio.', 403);
    }
    return $user;
}
