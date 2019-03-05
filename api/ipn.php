<?php namespace Listener;

require("_db.php");

// Set this to true to use the sandbox endpoint during testing:
$enable_sandbox = false;

// Use this to specify all of the email addresses that you have attached to paypal:
$my_email_addresses = array("dario.rubado@gmail.com", "teamwaza@hotmail.it", "my_email_address3@gmail.com");

// Set this to true to send a confirmation email:
$send_confirmation_email = true;
$confirmation_email_address = "My Name <dario.rubado@gmail.com>";
$from_email_address = "My Name <dario.rubado@gmail.com>";

// Set this to true to save a log file:
$save_log_file = true;
$log_file_dir = __DIR__ . "/logs";

require('PaypalIPN.php');

use PaypalIPN;

$ipn = new PaypalIPN();

// Use the sandbox endpoint during testing.
if ($enable_sandbox) {
    $ipn->useSandbox();
}

$verified = $ipn->verifyIPN();
$data_text = "";
foreach ($_POST as $key => $value) {
    $data_text .= $key . " = " . $value . "\r\n";
}

$test_text = "";
if ($_POST["test_ipn"] == 1) {
    $test_text = "Test ";
}

// Check the receiver email to see if it matches your list of paypal email addresses
$receiver_email_found = false;
foreach ($my_email_addresses as $a) {
    if (strtolower($_POST["receiver_email"]) == strtolower($a)) {
        $receiver_email_found = true;
        break;
    }
}

date_default_timezone_set("Europe/Rome");
list($year, $month, $day, $hour, $minute, $second, $timezone) = explode(":", date("Y:m:d:H:i:s:T"));
$date = $year . "-" . $month . "-" . $day;
$timestamp = $date . " " . $hour . ":" . $minute . ":" . $second . " " . $timezone;
$dated_log_file_dir = $log_file_dir . "/" . $year . "/" . $month;

$paypal_ipn_status = "VERIFICATION FAILED";
if ($verified) {
    $paypal_ipn_status = "RECEIVER EMAIL MISMATCH";
    if ($receiver_email_found) {
        $paypal_ipn_status = "Completed Successfully";

        if($_POST["custom"]){
            $clausole = " WHERE idpagamento LIKE '".$_POST["custom"]."';";
            $set1 = " set ipn_status = "."'".$_POST["payment_status"]."',";
            $set1 .= " active = 1,";
            $set1 .= " ipn_id = "."'".$_POST["txn_id"]."',";
            $set1 .= " payer_email = "."'".$_POST["payer_email"]."' ";
            $query = "UPDATE iscritti".$set1.$clausole;
            \queryBuilder($query);
            $data_text .=$query. "\r\n";
        }

        // Process IPN
        // A list of variables are available here:
        // https://developer.paypal.com/webapps/developer/docs/classic/ipn/integration-guide/IPNandPDTVariables/

        // This is an example for sending an automated email to the customer when they purchases an item for a specific amount:
        if ($_POST["payment_status"] == "Completed") {
            $email_to = $_POST["first_name"] . " " . $_POST["last_name"] . " <" . $_POST["payer_email"] . ">";
            $email_subject = $test_text . "Iscrizione Completata " . $_POST["item_name"];
            $email_body = "Iscrizione al torneo WazaKids è andata a buon fine " . $_POST["item_name"] . "." . "\r\n" . "\r\n" . "." . "\r\n" . "\r\n" . "Thank you.";
            mail($email_to, $email_subject, $email_body, "From: " . $from_email_address);
        }


    }
} elseif ($enable_sandbox) {
    if ($_POST["test_ipn"] != 1) {
        $paypal_ipn_status = "RECEIVED FROM LIVE WHILE SANDBOXED";
    }
} elseif ($_POST["test_ipn"] == 1) {
    $paypal_ipn_status = "RECEIVED FROM SANDBOX WHILE LIVE";
}

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
    // Restrict web access to files in the log file directory
    // $htaccess_body = "RewriteEngine On" . "\r\n" . "RewriteRule .* - [L,R=404]";
    // if ($save_log_file && (!is_file($log_file_dir . "/.htaccess") || file_get_contents($log_file_dir . "/.htaccess") !== $htaccess_body)) {
    //     if (!is_dir($log_file_dir . "/.htaccess")) {
    //         file_put_contents($log_file_dir . "/.htaccess", $htaccess_body);
    //         if (!is_file($log_file_dir . "/.htaccess") || file_get_contents($log_file_dir . "/.htaccess") !== $htaccess_body) {
    //             $save_log_file = false;
    //         }
    //     } else {
    //         $save_log_file = false;
    //     }
    // }
    if ($save_log_file) {
        // Save data to text file
        file_put_contents($dated_log_file_dir . "/" . $test_text . "paypal_ipn_" . $date . ".txt", "paypal_ipn_status = " . $paypal_ipn_status . "\r\n" . "paypal_ipn_date = " . $timestamp . "\r\n" . $data_text . "\r\n", FILE_APPEND);
    }
}

if ($send_confirmation_email) {
    // Send confirmation email
    mail($confirmation_email_address, $test_text . "PayPal IPN : " . $paypal_ipn_status, "paypal_ipn_status = " . $paypal_ipn_status . "\r\n" . "paypal_ipn_date = " . $timestamp . "\r\n" . $data_text, "From: " . $from_email_address);
}

// Reply with an empty 200 response to indicate to paypal the IPN was received correctly
header("HTTP/1.1 200 OK");
