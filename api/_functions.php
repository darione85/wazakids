<?php

// Token generator
function random_string($length) {
    $string = "";

    // genera una stringa casuale che ha lunghezza
    // uguale al multiplo di 32 successivo a $length
    for ($i = 0; $i <= ($length/32); $i++)
        $string .= md5(time()+rand(0,99));

    // indice di partenza limite
    $max_start_index = (32*$i)-$length;

    // seleziona la stringa, utilizzando come indice iniziale
    // un valore tra 0 e $max_start_point
    $random_string = substr($string, rand(0, $max_start_index), $length);

    return $random_string;
}

// Send registration mail
function send_registration_mail($toUsr, $subject, $message){

    // Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    // More headers
    $headers .= 'From: <no-reply@inr2018.it>' . "\r\n";
    //$headers .= 'Ccr: manuel.cavallaro@cimafoundation.org' . "\r\n";

    mail($toUsr,$subject,$message,$headers);

}

function decode(){
	$inputJSON = file_get_contents('php://input');
	return json_decode($inputJSON);
}

function encode($results){
	header('Content-Type: application/json');

	$rows = array();
	$count = 0;
	while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
		$rows['iscritti'][]= $row;
		$count++;
	}
	$rows['records']= $count;
	echo json_encode($rows);
}


?>