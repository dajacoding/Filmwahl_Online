<?php
include 'config.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (isset($data['wahl']) && is_array($data['wahl'])) {
    $film_ids = $data['wahl'];

    $sql = "INSERT INTO waehler (waehler_anmeldung) VALUES (1);";
    mysqli_query($conn, $sql);
    $sql = "SELECT LAST_INSERT_ID() AS waehler_id;";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        $waehler_id = $row['waehler_id'];
        $position = 1;
        $values = [];
        $types = "";
    
        foreach ($film_ids as $film_id) {
            $values[] = $waehler_id;
            $values[] = $film_id;
            $values[] = $position;
            $types .= "iii";
            $position++;
        }
    
        $placeholders = rtrim(str_repeat("(?,?,?),", count($film_ids)), ",");
        $sql = "INSERT INTO wahl (wahl_waehler_id, wahl_filme_id, wahl_filme_position) 
                VALUES " . $placeholders;
    
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, $types, ...$values);
        mysqli_stmt_execute($stmt);
    }
    mysqli_close($conn);

    $response = [
        'status' => 'success'
    ];
} else {
    $response = [
        'status' => 'error'
    ];
}
header('Content-Type: application/json');
echo json_encode($response);


?>