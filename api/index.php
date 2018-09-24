<?php namespace Listener;

require('PaypalIPN.php');

use PaypalIPN;

define("DB","waza.db");




$request = $_SERVER['QUERY_STRING'];

switch ($request) {
	case "":
		phpinfo();
		break;
	case "getiscritti":
		getIscritti();
        break;
	case "saveiscritti":
		saveIscritti();
        break;
	case "ipnlistener":
		
		$ipn = new PaypalIPN();
		ipnListener($ipn);
		break;
	case "testing":
		break;
    default:
		getIscritti();
}


function saveIscritti (){

	 $aoIscritti = decode();

	 var_dump($aoIscritti);

	 /* [
		{
		  "active": 1,
		  "name": "nome",
		  "surname": "cognome",
		  "mail": "pluto@pluto.it",
		  "società": "WAZA",
		  "figmma": "15",
		  "age": 15,
		  "categoria": "",
		  "peso_categoria": "",
		  "gender": "male",
		  "weight": 65,
		  "idpagamento": "id"
		},
		{
		  "active": 1,
		  "name": "nome",
		  "surname": "cognome",
		  "mail": "pluto@pluto.it",
		  "società": "WAZA",
		  "figmma": "10",
		  "age": 15,
		  "categoria": "",
		  "peso_categoria": "",
		  "gender": "male",
		  "weight": 65,
		  "idpagamento": "id"
		}
	  ] */

	

	foreach( $aoIscritti as $iscritto) {
		var_dump($iscritto);
		$string = 'INSERT INTO iscritti ';
		$strName='(';
		$strValue='(';
		foreach($iscritto as $key => $value){
			$strName .= "'".$key."',";
			$strValue .= "'".$value."',";
		}
		$strName.=')';
		$strValue.=')';
	  }
	
	echo $string.$strName.$strValue;
	#queryBuilder($string.$strName.$strValue);

}


function getIscritti(){
	$query = 'SELECT * FROM iscritti';
	queryBuilder($query,encode);
}

function queryBuilder($query, $func){
	$db = new \SQLite3(DB) or die('Unable to open database');;

	$results = $db->query($query);

	if($func){
		$func($results);
	}
	
	$db->close();
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



function returnErrorCode($message){

    $rows = array();
    $rows['modulo']['noaccess'] = $message;
    header('Content-Type: application/json');
    echo json_encode($rows);
}

function wh_log($log_msg)
{
    $log_filename = "log";
    if (!file_exists($log_filename)) 
    {
        // create directory/folder uploads.
        mkdir($log_filename, 0777, true);
    }
    $log_file_data = $log_filename.'/log_' . date('d-M-Y') . '.log';
    file_put_contents($log_file_data, $log_msg . "\n", FILE_APPEND);
}



function ipnListener($ipn){

	// Use the sandbox endpoint during testing.
	$ipn->useSandbox();
	#$verified = $ipn->verifyIPN();
	$verified = true;
	$save_log_file = true;
	$test_text = "";
	$data_text = "";
	
	$paypal_ipn_status = "RECEIVED FROM LIVE WHILE SANDBOXED";


	foreach ($_POST as $key => $value) {
		$data_text .= $key . " = " . $value . "\r\n";
	}
	#if ($_POST["test_ipn"] == 1) {
#		$test_text = "Test ";
	#}
	$log_file_dir = $log_file_dir = __DIR__ . "/log";
	
	list($year, $month, $day, $hour, $minute, $second, $timezone) = explode(":", date("Y:m:d:H:i:s:T"));
	$date = $year . "-" . $month . "-" . $day;

	$timestamp = $date . " " . $hour . ":" . $minute . ":" . $second . " " . $timezone;
	$dated_log_file_dir = $log_file_dir . "/" . $year . "/" . $month;

	//wh_log(json_encode($ipn));
	if ($verified) {
		/*
		* Process IPN
		* A list of variables is available here:
		* https://developer.paypal.com/webapps/developer/docs/classic/ipn/integration-guide/IPNandPDTVariables/
		*/
		if ($save_log_file) {
			// Create log file directory
			if (!is_dir($dated_log_file_dir)) {
				if (!file_exists($dated_log_file_dir)) {
					mkdir($dated_log_file_dir, 0777, true);
					if (!is_dir($dated_log_file_dir)) {
						$save_log_file = false;
					}
				} else {
					$save_log_file = false;
				}
			}
		
			if ($save_log_file) {
				// Save data to text file
				file_put_contents($dated_log_file_dir . "/" . $test_text . "paypal_ipn_" . $date . ".txt", "paypal_ipn_status = " . $paypal_ipn_status . "\r\n" . "paypal_ipn_date = " . $timestamp . "\r\n" . $data_text . "\r\n", FILE_APPEND);
			}
		}


	}

	// Reply with an empty 200 response to indicate to paypal the IPN was received correctly.
	header("HTTP/1.1 200 OK");
}