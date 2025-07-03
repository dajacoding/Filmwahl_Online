<?php
include 'config.php';

$sid = isset($_GET['sid']) ? $_GET['sid'] : '';


echo "<meta charset='UTF-8'>";

echo "<body style='background-color: black;color: white;font-size: 50px'>";

echo "<form action='reset.php' method='post'>
<input type='hidden' name='sid' value='$sid'>
<input type='submit' value='Reset'>
</form>";  

echo "Sitzungs-ID: $sid";

$heute = date('Y-m-d');
$sql = "SELECT * FROM filme WHERE filme_sid = '$sid' ORDER BY filme_id DESC";
$result = mysqli_query($conn, $sql);
$data = array();


echo "<h3>Filme zur Auswahl</h3>";
echo "<ul>";
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
    $json = json_decode($row['filme_imdb_json'], true);
    echo "<li>{$json['Title']}</li>";
}
echo "</ul>";

echo "<h3>Neuen Vorschlag hinzufügen (IMDB-ID)</h3>";
echo "<form action='add_entry.php' method='post'>
        <input type='hidden' name='sid' value='$sid'>
        <input type='text' name='imdb_id' required>
        <input type='submit' value='Hinzufügen'>
        </form>";

echo "<h3>Wahl beginnen</h3>";
echo "<form action='initiate_vote.php' method='post'>
      <input type='hidden' name='sid' value='$sid'>
      <input type='submit' value='Wählen'>
      </form>";          

mysqli_close($conn);

?>
