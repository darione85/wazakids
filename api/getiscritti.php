<?php
require('_db.php');
require('_functions.php');

function getIscritti(){

    $query = 'SELECT * FROM iscritti';

    if($_GET['guid']){
        $guid = $_GET['guid'];
        $query .= " WHERE idpagamento LIKE '".$guid."';";
    }
    
	queryBuilder($query,encode);
}

getIscritti();