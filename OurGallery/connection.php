<?php

//conexion
function connectDB(){

  $server = "127.5.251.2";
	$user = "adminHL84XnK";
	$pass = "23bUE1uWhHbW";
	$bd = "photo";

 $conexion = mysqli_connect($server, $user, $pass, $bd) or die ("<center>ERROR DE CONEXION</center>");
  if(!$conexion){
      echo 'Ha sucedido un error inesperado en la conexión de la base de datos';
  }

  return $conexion;
}

function disconnectDB($conexion){

    $close = mysqli_close($conexion);

        if($close){
            //echo 'La desconexion de la base de datos se ha hecho satisfactoriamente';
        }else{
            echo 'Ha sucedido un error inexperado en la desconexion de la base de datos';
        }

    return $close;
}

function getArraySQL($sql){
    //Creamos la conexión con la función anterior
    $conexion = connectDB();

    //generamos la consulta
    mysqli_set_charset($conexion, "utf8"); //formato de datos utf8

    $result = mysqli_query($conexion, $sql);

    if(! $sql ){
      echo "La consulta no se logró: ".mysql_error();
      die();    //si la conexión cancelar programa
    }

    //creamos un array
    $rawdata = array();

    //guardamos en un array multidimensional todos los datos de la consulta
    $i=0;

    while($row = mysqli_fetch_array($result)){
        $rawdata[$i] = $row;
        $i++;
    }

    header("Content-type: application/json");
    header("Access-Control-Allow-Origin: *");

    disconnectDB($conexion); //desconectamos la base de datos


    return $rawdata; //devolvemos el array
}

$sql = "SELECT * FROM tabla_productos";
$myArray = getArraySQL($sql);
echo json_encode($myArray);

?>
