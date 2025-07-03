<?php
include 'config.php';

$sid = isset($_POST['sid']) ? $_POST['sid'] : '';

$sql = "DELETE FROM filme WHERE filme_sid = '$sid'";
mysqli_query($conn, $sql);
mysqli_close($conn);

header('Location: list.php' . '?sid=' . $sid);

exit();
?>
