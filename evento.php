<?php
if (isset($_GET['id'])) {
    if ($_GET['id'] != "") {
        $token = '';
        $url = 'https://www.eventbriteapi.com/v3/events/'.$_GET['id'].'/?token='.$token;
        var_dump(file_get_contents($url), true);

    }
    // cURL option
//    if(is_callable('curl_init')) {
//        $ch = curl_init();
//        var_dump($url.'?'.$params);echo '<br>';
//        curl_setopt($ch, CURLOPT_URL, $url.'?'.$params ); //Url together with parameters
//        curl_setopt($ch, CURLOPT_HEADER, false); // no guarda las cabeceras
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //Return data instead printing directly in Browser
//        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT , 20); //Timeout after 20 seconds
//        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER , false); // Avoid SSL verification
//
//        $result = curl_exec($ch);
//        if(curl_errno($ch))  //catch if curl error exists and show it
//            echo 'Curl error: ' . curl_error($ch);
//        else
//            var_dump($result);echo '<br>';
//
//        curl_close($ch);
//    } else {
//        echo 'error, llamable';
//    }
}

?>
