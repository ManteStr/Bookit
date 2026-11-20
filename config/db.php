<?php
/**
 * Shared PDO database connection for db_bookit.
 */

function getDbConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $configPath = __DIR__ . '/config.php';
    if (!file_exists($configPath)) {
        throw new RuntimeException(
            'Missing config/config.php. Copy config/config.example.php to config/config.php and add your database credentials.'
        );
    }

    $config = require $configPath;
    $db = $config['db'] ?? [];

    $host    = $db['host'] ?? '127.0.0.1';
    $port    = $db['port'] ?? '3306';
    $name    = $db['name'] ?? 'db_bookit';
    $user    = $db['user'] ?? '';
    $pass    = $db['pass'] ?? '';
    $charset = $db['charset'] ?? 'utf8mb4';

    if ($user === '') {
        throw new RuntimeException(
            'Database username is empty in config/config.php. Please set your credentials first.'
        );
    }

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $host, $port, $name, $charset);

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);
    return $pdo;
}
