<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Filmwahl</title>
</head>
<body>
    <h1>Donnerstags-Film-Wahlomat</h1>
    <p>Das aktuelle Datum und die Uhrzeit sind: 
    <?php
    echo date("d.m.Y H:i:s");
    ?>
    </p>
    <?php

    header("Location: donnerstag_vote/sid_gen.php")
    ?>

    
</body>
</html>

