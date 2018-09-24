<?php
define("DB","waza.db");

// require('_functions.php');

function queryBuilder($query, $func){
	$db = new SQLite3(DB);
    echo $query;
	$results = $db->query($query);

	if($func){
		$func($results);
	}
	
	$db->close();
}

?>