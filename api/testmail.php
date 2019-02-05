<?php
 $confirmation_email_address = "My Name <dario.rubado@gmail.com>";
 mail($confirmation_email_address, $test_text . "PayPal IPN : " . "confirmed", "paypal_ipn_status = " . "accepted" . "\r\n" . "paypal_ipn_date = " . "tempo" . "\r\n" . "text", "From: " . "pinpallino");
