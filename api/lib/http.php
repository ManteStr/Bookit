<?php
declare(strict_types=1);

/**
 * HTTP pagalbinės funkcijos: JSON atsakymai, užklausos kūnas, maršruto nustatymas.
 *
 * Visi API atsakymai yra JSON:
 *   sėkmė:  { "ok": true,  ...duomenys }
 *   klaida: { "ok": false, "error": "Tekstas vartotojui", "field": "el_pastas" }
 */

/** Išsiunčia JSON atsakymą ir baigia vykdymą. */
function json_response(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Išsiunčia klaidos atsakymą (field nurodo, kuris formos laukas klaidingas). */
function json_error(string $message, int $status = 400, ?string $field = null): never
{
    $payload = ['ok' => false, 'error' => $message];
    if ($field !== null) {
        $payload['field'] = $field;
    }
    json_response($payload, $status);
}

/**
 * Nuskaito POST užklausos JSON kūną.
 * Reikalaujame Content-Type: application/json - tai papildoma apsauga nuo
 * CSRF (kitoje svetainėje esanti paprasta HTML forma tokio tipo užklausos
 * išsiųsti negali).
 */
function read_json_body(): array
{
    $type = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    if (!str_starts_with($type, 'application/json')) {
        json_error('Netinkamas užklausos tipas.', 415);
    }

    $raw = file_get_contents('php://input', false, null, 0, 65536);
    if ($raw === false || $raw === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Neteisingas užklausos formatas.', 400);
    }
    return $data;
}

/** Paima tekstinį lauką iš JSON kūno (visada grąžina trim'intą string). */
function body_string(array $body, string $key): string
{
    $value = $body[$key] ?? '';
    return is_string($value) ? trim($value) : '';
}

/**
 * Nustato, kokio API maršruto prašoma, pvz. "auth/login".
 * Palaikomi trys būdai:
 *   1) ?r=auth/login                      (naudoja Vite proxy kūrimo metu)
 *   2) /bookit/api/index.php/auth/login   (PATH_INFO)
 *   3) /bookit/api/auth/login             (per api/.htaccess perrašymą)
 */
function request_route(): string
{
    if (isset($_GET['r']) && is_string($_GET['r'])) {
        $route = $_GET['r'];
    } else {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $path = is_string($path) ? $path : '/';
        $pos = strpos($path, '/api/');
        $route = $pos === false ? '' : substr($path, $pos + 5);
        $route = preg_replace('#^index\.php/?#', '', $route) ?? '';
    }

    $route = trim($route, '/');
    // Tik saugūs simboliai.
    return preg_match('#^[a-z0-9_/-]*$#i', $route) === 1 ? strtolower($route) : '';
}

/** Ar užklausa atėjo per HTTPS (naudojama slapuko "secure" vėliavėlei). */
function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

/** Ar užklausa iš to paties kompiuterio (naudojama tik diagnostikai). */
function is_local_request(): bool
{
    return in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true);
}
