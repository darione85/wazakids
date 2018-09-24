<?php
require('_db.php');
require('_functions.php');

function getIscritti(){
    $query = 'SELECT * FROM iscritti';
    
	queryBuilder($query,encode);
}

getIscritti();