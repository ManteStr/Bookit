<?php
declare(strict_types=1);

/**
 * Sukuria administratoriaus paskyrą (arba esamą vartotoją paverčia administratoriumi).
 * Paleidžiama TIK iš komandų eilutės, ne per naršyklę.
 *
 * Windows + XAMPP (PowerShell, bookit aplanke):
 *   C:\xampp\php\php.exe api\tools\create_admin.php adminas@admin.vilniustech.lt Vardas Pavarde
 *
 * Slaptažodžio paprašys paleidus (jis nerašomas nei į jokį failą, nei į komandų istoriją).
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Tik komandų eilutei.');
}

require_once __DIR__ . '/../bootstrap.php';

if ($argc < 4) {
    fwrite(STDERR, "Naudojimas: php api/tools/create_admin.php <el_pastas> <vardas> <pavarde>\n");
    exit(1);
}

$email   = mb_strtolower(trim($argv[1]));
$vardas  = trim($argv[2]);
$pavarde = trim($argv[3]);

if (filter_var($email, FILTER_VALIDATE_EMAIL) === false || $vardas === '' || $pavarde === '') {
    fwrite(STDERR, "Neteisingas el. paštas, vardas arba pavardė.\n");
    exit(1);
}

$pdo = getDbConnection();

$stmt = $pdo->prepare('SELECT role_id FROM roles WHERE pavadinimas = ?');
$stmt->execute([ROLE_ADMIN]);
$adminRoleId = $stmt->fetchColumn();
if ($adminRoleId === false) {
    fwrite(STDERR, "Lentelėje roles nėra rolės '" . ROLE_ADMIN . "'. Ar importavote db_bookit.sql?\n");
    exit(1);
}

$stmt = $pdo->prepare('SELECT vartotojo_id FROM vartotojai WHERE el_pastas = ?');
$stmt->execute([$email]);
$existingId = $stmt->fetchColumn();

if ($existingId !== false) {
    $stmt = $pdo->prepare('UPDATE vartotojai SET role_id = ? WHERE vartotojo_id = ?');
    $stmt->execute([(int) $adminRoleId, (int) $existingId]);
    echo "Vartotojas $email jau egzistavo, dabar jis administratorius (slaptažodis nepakeistas).\n";
    exit(0);
}

// Slaptažodžio įvedimas (Linux/macOS: paslėptas, Windows: matomas).
echo 'Slaptažodis (bent ' . MIN_PASSWORD_LENGTH . ' simboliai): ';
$isWindows = stripos(PHP_OS_FAMILY, 'Windows') === 0;
if (!$isWindows) {
    shell_exec('stty -echo');
}
$password = trim((string) fgets(STDIN));
if (!$isWindows) {
    shell_exec('stty echo');
    echo "\n";
}

if (mb_strlen($password) < MIN_PASSWORD_LENGTH || strlen($password) > MAX_PASSWORD_BYTES) {
    fwrite(STDERR, "Slaptažodis turi būti nuo " . MIN_PASSWORD_LENGTH . " iki " . MAX_PASSWORD_BYTES . " simbolių.\n");
    exit(1);
}

$stmt = $pdo->prepare(
    'INSERT INTO vartotojai (vardas, pavarde, el_pastas, slaptazodzio_hash, role_id, reg_data)
     VALUES (?, ?, ?, ?, ?, ?)'
);
$stmt->execute([
    $vardas,
    $pavarde,
    $email,
    password_hash($password, PASSWORD_DEFAULT),
    (int) $adminRoleId,
    date('Y-m-d'),
]);

echo "Administratorius $email sukurtas.\n";
