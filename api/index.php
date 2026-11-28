<?php
declare(strict_types=1);

/**
 * BookIT API: vienintelis įėjimo taškas. Visos užklausos eina per čia.
 *
 * Kad pridėtumėte naują maršrutą:
 *   1) parašykite funkciją api/routes/<failas>.php
 *   2) įtraukite failą žemiau (require_once)
 *   3) įrašykite eilutę į $routes: 'METODAS maršrutas' => 'funkcija'
 */

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/routes/ping.php';
require_once __DIR__ . '/routes/auth.php';
require_once __DIR__ . '/routes/rooms.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$routes = [
    'GET ping'           => 'route_ping',
    'GET auth/me'        => 'route_auth_me',
    'POST auth/register' => 'route_auth_register',
    'POST auth/login'    => 'route_auth_login',
    'POST auth/logout'   => 'route_auth_logout',
    'GET rooms'          => 'route_rooms_list',
];

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $route  = request_route();
    $key    = $method . ' ' . $route;

    if (isset($routes[$key])) {
        $routes[$key]();
    }

    // Maršrutas yra, bet kitas HTTP metodas?
    foreach (array_keys($routes) as $known) {
        if (substr($known, strpos($known, ' ') + 1) === $route) {
            json_error('Šis metodas čia nepalaikomas.', 405);
        }
    }
    json_error('Nežinomas API maršrutas.', 404);
} catch (Throwable $e) {
    // Tikslią klaidą rašome į Apache klaidų žurnalą (xampp/apache/logs/error.log),
    // o naršyklei siunčiame bendrą tekstą, kad neatskleistume vidinių detalių.
    error_log('BookIT API klaida: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    json_error('Serverio klaida. Bandykite dar kartą vėliau.', 500);
}
