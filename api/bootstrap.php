<?php
declare(strict_types=1);

/**
 * Bendras API paleidimo failas: nustatymai, DB prisijungimas, pagalbinės funkcijos.
 * DB prisijungimas imamas iš ../config/db.php (getDbConnection()).
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/lib/http.php';
require_once __DIR__ . '/lib/auth.php';

date_default_timezone_set('Europe/Vilnius');

// Rolių pavadinimai DB lentelėje `roles`.
const ROLE_ADMIN = 'Admin';
const ROLE_USER  = 'Vartotojas';
const ROLE_GUEST = 'Svecias'; // VIP svečias (paskyrą sukuria administratorius)

// Viešai registruotis galima tik su universiteto paštu.
const UNIVERSITY_EMAIL_PATTERN = '/@(stud\.)?vilniustech\.lt$/i';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES  = 72; // bcrypt riba

/** Ar el. paštas turi universiteto galūnę. */
function is_university_email(string $email): bool
{
    return preg_match(UNIVERSITY_EMAIL_PATTERN, $email) === 1;
}
