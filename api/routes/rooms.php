<?php
declare(strict_types=1);

/**
 * GET rooms - viešas kambarių sąrašas (mato ir svečias, ir prisijungęs).
 *
 * Grąžina viską vienu atsakymu (kambarių nedaug), o filtruoja jau naršyklė:
 *   bibliotekos: [ { id, pavadinimas, adresas, aukstas, zemelapis } ]
 *   kambariai:   [ { id, bibliotekos_id, pavadinimas, nr, aukstas, talpa, stalu_sk,
 *                    kedziu_sk, nuotrauka, iranga: [ { id, pavadinimas, kiekis } ] } ]
 *   iranga:      [ { id, pavadinimas } ]   (filtro pasirinkimams)
 *
 * Rodomi tik kambariai, kurių busena = 'aktyvus'.
 */
function route_rooms_list(): never
{
    $pdo = getDbConnection();

    $libraries = [];
    foreach ($pdo->query('SELECT bibliotekos_id, pavadinimas, adresas, aukstas, zemelapio_url FROM bibliotekos ORDER BY bibliotekos_id') as $row) {
        $libraries[] = [
            'id'          => (int) $row['bibliotekos_id'],
            'pavadinimas' => $row['pavadinimas'],
            'adresas'     => $row['adresas'],
            'aukstas'     => $row['aukstas'],
            'zemelapis'   => trim((string) $row['zemelapio_url']) !== '' ? trim((string) $row['zemelapio_url']) : null,
        ];
    }

    $equipmentList = [];
    foreach ($pdo->query('SELECT irangos_id, pavadinimas FROM iranga ORDER BY irangos_id') as $row) {
        $equipmentList[] = ['id' => (int) $row['irangos_id'], 'pavadinimas' => $row['pavadinimas']];
    }

    // Įranga pagal kambarį: [kambario_id => [ {id, pavadinimas, kiekis}, ... ]]
    $equipmentByRoom = [];
    $stmt = $pdo->query(
        'SELECT ki.kambario_id, i.irangos_id, i.pavadinimas, ki.kiekis
           FROM kambario_iranga ki
           JOIN iranga i ON i.irangos_id = ki.irangos_id
          ORDER BY i.irangos_id'
    );
    foreach ($stmt as $row) {
        $equipmentByRoom[(int) $row['kambario_id']][] = [
            'id'          => (int) $row['irangos_id'],
            'pavadinimas' => $row['pavadinimas'],
            'kiekis'      => (int) $row['kiekis'],
        ];
    }

    $rooms = [];
    $stmt = $pdo->prepare(
        'SELECT kambario_id, bibliotekos_id, pavadinimas, kambario_nr, aukstas, talpa, stalu_sk, kedziu_sk, nuotraukos_url
           FROM kambariai
          WHERE busena = ?
          ORDER BY bibliotekos_id, kambario_id'
    );
    $stmt->execute(['aktyvus']);
    foreach ($stmt as $row) {
        $id = (int) $row['kambario_id'];
        $photo = trim((string) $row['nuotraukos_url']);
        $rooms[] = [
            'id'             => $id,
            'bibliotekos_id' => (int) $row['bibliotekos_id'],
            'pavadinimas'    => $row['pavadinimas'],
            'nr'             => $row['kambario_nr'],
            'aukstas'        => (int) $row['aukstas'],
            'talpa'          => (int) $row['talpa'],
            'stalu_sk'       => (int) $row['stalu_sk'],
            'kedziu_sk'      => (int) $row['kedziu_sk'],
            'nuotrauka'      => $photo !== '' ? $photo : null,
            'iranga'         => $equipmentByRoom[$id] ?? [],
        ];
    }

    json_response([
        'ok'          => true,
        'bibliotekos' => $libraries,
        'kambariai'   => $rooms,
        'iranga'      => $equipmentList,
    ]);
}
