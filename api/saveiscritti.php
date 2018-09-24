<?php
require('_db.php');
require('_functions.php');

function saveIscritti (){

    $aoIscritti = decode();

    

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

   if($aoIscritti == NULL) {
       //echo "error no array passed";
       //var_dump($aoIscritti);
   }else{
    //echo"array";
    //var_dump($aoIscritti);
    //echo"rows";
    //var_dump($aoIscritti->rows);
   }

   foreach( $aoIscritti->rows as $iscritto) {
       //echo"iscritto";
       //var_dump($iscritto);
       $string = 'INSERT INTO iscritti ';
       $strName='(';
       $strValue='(';
       foreach($iscritto as $key => $value){
           #$strName .= "'".$key."',";
           $strName .= $key.",";
           //echo"value";
           //var_dump($value);
           $strValue .= "'".$value."',";
       }
        $strName =rtrim($strName,",");
        $strValue =rtrim($strValue,",");

       $strName.=')';
       $strValue.=')';
     }
   
   #echo $string.$strName.$strValue;
   queryBuilder($string.$strName." VALUES ".$strValue, NULL);
}

saveIscritti();

#curl 'http://backend.wazakids.it/api/saveiscritti.php' -H 'Pragma: no-cache' -H 'Origin: http://backend.wazakids.it' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: it,en;q=0.9,es;q=0.8,de;q=0.7' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'Cache-Control: no-cache' -H 'Referer: http://backend.wazakids.it/client/' -H 'Cookie: _ga=GA1.2.1599967392.1536756884' -H 'Connection: keep-alive' --data-binary $'{"rows":[{"active":1,"name":"nome","surname":"cognome","mail":"pluto@pluto.it","societ\xe0":"WAZA","figmma":15,"age":15,"categoria":"","peso_categoria":"","gender":"male","weight":65,"idpagamento":"id"}]}' --compressed