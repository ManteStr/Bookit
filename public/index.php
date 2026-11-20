<?php
require_once __DIR__ . '/../config/db.php';

$statusMessage = '';
$errorMessage = '';
$libraries = [];
$tableCounts = [];

$tables = [
    'roles',
    'vartotojai',
    'bibliotekos',
    'kambariai',
    'iranga',
    'kambario_iranga',
    'rezervacijos',
    'pranesimu_prenumeratos',
];

try {
    $pdo = getDbConnection();
    $statusMessage = 'Connected to MariaDB/MySQL database: db_bookit';

    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) AS cnt FROM `{$table}`");
        $tableCounts[$table] = (int) $stmt->fetchColumn();
    }

    $stmtLibs = $pdo->query('SELECT bibliotekos_id, pavadinimas, adresas, aukstas FROM bibliotekos ORDER BY bibliotekos_id ASC');
    $libraries = $stmtLibs->fetchAll();
} catch (Throwable $e) {
    $errorMessage = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookIt — Base Starter</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 820px; margin: 40px auto; padding: 0 16px; color: #1f2937; }
        .ok { background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 12px 16px; border-radius: 6px; }
        .err { background: #fef2f2; border: 1px solid #ef4444; color: #991b1b; padding: 12px 16px; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        th { background: #f9fafb; }
    </style>
</head>
<body>
    <h1>BookIt Base Project</h1>

    <?php if ($errorMessage !== ''): ?>
        <div class="err"><strong>Setup / Connection Notice:</strong> <?= htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8') ?></div>
    <?php else: ?>
        <div class="ok"><?= htmlspecialchars($statusMessage, ENT_QUOTES, 'UTF-8') ?></div>

        <h2>Table Row Counts</h2>
        <table>
            <thead>
                <tr><th>Table</th><th>Rows</th></tr>
            </thead>
            <tbody>
                <?php foreach ($tableCounts as $tbl => $cnt): ?>
                    <tr>
                        <td><code><?= htmlspecialchars($tbl, ENT_QUOTES, 'UTF-8') ?></code></td>
                        <td><?= $cnt ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <h2>Libraries (<code>bibliotekos</code>)</h2>
        <?php if (empty($libraries)): ?>
            <p>No records in <code>bibliotekos</code> yet.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Address</th><th>Floor</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($libraries as $lib): ?>
                        <tr>
                            <td><?= (int) $lib['bibliotekos_id'] ?></td>
                            <td><?= htmlspecialchars($lib['pavadinimas'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars($lib['adresas'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars($lib['aukstas'], ENT_QUOTES, 'UTF-8') ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    <?php endif; ?>
</body>
</html>
