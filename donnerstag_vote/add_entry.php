<?php
include 'config.php';

$sid = isset($_POST['sid']) ? $_POST['sid'] : '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    function getAPIContent($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }
    
    $imdb_id = $_POST['imdb_id'];
    $apiUrl = $imdb_api_call . $imdb_id . $imdb_api_key;
    $content = getAPIContent($apiUrl);
    $decodedContent = json_decode($content);
    if ($decodedContent && isset($decodedContent->Response) && $decodedContent->Response === "True") {
        $entry = mysqli_real_escape_string($conn, $content);
        $sql = "INSERT INTO filme (filme_imdb_json, filme_imdb_id, filme_datum, filme_sid)
                SELECT '$entry', '$imdb_id', CURDATE(), '$sid'
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM filme 
                    WHERE filme_sid = '$sid'
                    AND filme_imdb_id = '$imdb_id'
                );";
        mysqli_query($conn, $sql);
        }
    }
    
mysqli_close($conn);

header('Location: list.php' . '?sid=' . $sid);
exit();
?>
