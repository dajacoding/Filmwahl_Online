<?php
define('DB_HOST', '*******');
define('DB_USER', '*******');
define('DB_PASS', '*******');
define('DB_NAME', '*******');


$imdb_api_call = 'http://www.omdbapi.com/?i=';
$imdb_api_key =  '&apikey=*******';

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if (!$conn) {
    die("Verbindung fehlgeschlagen: " . mysqli_connect_error() . " (Error-Nr: " . mysqli_connect_errno() . ") ");
}
?>
