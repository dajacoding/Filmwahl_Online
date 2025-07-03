<?php
$sid = isset($_POST['sid']) ? $_POST['sid'] : '';
$url = "https://dovote.davidjann.de/donnerstag_vote/neuer_nutzer.php?sid=" . urlencode($sid);
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background: black;
            color: white;
        }
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
        }
        .qr-wrapper {
            flex: 1 1 auto;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
        }
        .qr-code {
            max-width: 90vw;
            max-height: 87vh;
            width: auto;
            height: auto;
            display: block;
        }
        form {
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="qr-wrapper">
        <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=<?php echo urlencode($url); ?>" 
            alt="QR-Code"
            class="qr-code"
        >
    </div>
    <form action="result.php?sid=<?php echo urlencode($sid); ?>" method="post">        
        <input type="submit" value="Ergebnis">
    </form>
</body>
</html>
