<?php
include 'config.php';

echo "<body style='background-color: black;'>";

$sid = isset($_GET['sid']) ? $_GET['sid'] : '';
$heute = date('Y-m-d');
$sql = "SELECT * FROM filme WHERE filme_sid = '$sid' ORDER BY filme_id DESC";
$result = mysqli_query($conn, $sql);
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

$json_data = json_encode($data);
echo "
          <style>canvas {border: 1px solid #000;}</style>
          <canvas id='meinCanvas'></canvas>
          <script>var phpData = " . $json_data . ";</script>
          <script src='show_list.js'></script>";

mysqli_close($conn);

?>