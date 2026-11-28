# BookIT API (PHP)

Visos užklausos eina per `api/index.php` ir grąžina JSON:

```
sėkmė:  { "ok": true, ... }
klaida: { "ok": false, "error": "Tekstas vartotojui", "field": "el_pastas" }
```

Prisijungimas - PHP sesija (HttpOnly slapukas). Slaptažodžiai DB saugomi tik kaip `password_hash()` (bcrypt).

## Maršrutai

| Metodas | Maršrutas       | Ką daro |
|---------|-----------------|---------|
| GET     | `ping`          | Patikra: ar veikia API ir DB, ar importuotas `02_pakeitimai.sql` |
| GET     | `auth/me`       | Prisijungęs vartotojas (`user`) arba `null` |
| POST    | `auth/register` | Registracija (tik `@vilniustech.lt` / `@stud.vilniustech.lt`), iškart prijungia |
| POST    | `auth/login`    | `{ el_pastas, slaptazodis, prisiminti }` |
| POST    | `auth/logout`   | Atjungia |
| GET     | `rooms`         | Kambarių sąrašas su įranga (viešas) |

POST užklausos privalo turėti `Content-Type: application/json` (CSRF apsauga).

## Patikrinti rankiniu būdu

Naršyklėje: `http://localhost/bookit/api/index.php?r=ping`
Turi rodyti `"db":true` ir `"migracija_02":true`.

## Administratoriaus paskyra

PowerShell, `C:\xampp\htdocs\bookit` aplanke:

```
C:\xampp\php\php.exe api\tools\create_admin.php adminas@admin.vilniustech.lt Vardas Pavarde
```

Paprašys slaptažodžio. Jei toks el. paštas jau užregistruotas, tiesiog tampa administratoriumi.

## Naujas maršrutas

1. Funkcija faile `api/routes/<failas>.php`
2. `require_once` į `api/index.php`
3. Eilutė `$routes` masyve: `'GET kambariai' => 'route_kambariai'`
