<?php
include 'config.php';

echo "<body style='background-color: black;'>";

$sid = isset($_GET['sid']) ? $_GET['sid'] : '';

$sql = "SELECT filme_id FROM filme WHERE filme_sid = '$sid'";
$result = mysqli_query($conn, $sql);

$ergebnis_tabelle = [];

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $sql = "SELECT wahl_filme_position FROM wahl WHERE wahl_filme_id = {$row['filme_id']} ORDER BY wahl_waehler_id;";
        $result_filme = mysqli_query($conn, $sql);
        $sql = "SELECT filme_imdb_json FROM filme WHERE filme_id = {$row['filme_id']}";
        $result_filme_json = mysqli_query($conn, $sql);
        
        $positionen = array();
        while ($row_filme = mysqli_fetch_assoc($result_filme)) {
            $positionen[] = $row_filme['wahl_filme_position'];
        }


        $ergebnis_tabelle[] = [
            "id" => htmlspecialchars($row['filme_id']),
            "wahl" => $positionen,
            "json" => mysqli_fetch_assoc($result_filme_json)
        ]; 
    }
}

echo "<style>canvas {border: 1px solid #000;}</style>
      <canvas id='meinCanvas'></canvas>
      <script>var phpData = " . json_encode($ergebnis_tabelle) . ";</script>
      <script src='show_result.js'></script>";


mysqli_close($conn);
?>
