<?php
if (isset($_GET['id'])){
    if ($_GET['id'] != "") {

        $token = '';
        $url = 'https://www.eventbriteapi.com/v3/events/'.$_GET['id'].'/?token='.$token;
        $obj = json_decode(file_get_contents($url), true);
        var_dump($obj);

    }
}

?>
