<?php
declare(strict_types=1);

/**
 * GET ping - patikra, ar API ir DB veikia. Atsidarykite naršyklėje:
 *   http://localhost/bookit/api/index.php?r=ping
 */
function route_ping(): never
{
    $result = ['ok' => true, 'api' => true, 'db' => false, 'migracija_02' => false];

    try {
        $pdo = getDbConnection();
        $pdo->query('SELECT 1 FROM roles LIMIT 1');
        $result['db'] = true;

        // Ar importuotas database/02_pakeitimai.sql?
        try {
            $pdo->query('SELECT uzblokuotas FROM vartotojai LIMIT 1');
            $result['migracija_02'] = true;
        } catch (Throwable $e) {
            $result['pastaba'] = 'Importuokite database/02_pakeitimai.sql per phpMyAdmin.';
        }
    } catch (Throwable $e) {
        $result['ok'] = false;
        error_log('BookIT ping: ' . $e->getMessage());
        if (is_local_request()) {
            $result['klaida'] = $e->getMessage();
        }
    }

    json_response($result, $result['ok'] ? 200 : 500);
}
