<?php

require_once "../../../scripts/app_config.php";

if(!is_user_admin()
	|| !$_REQUEST["food_menu"]
	|| !$_REQUEST["category"]) {

	echo "ERROR";
	exit();
}

$food_menu = get_menu_name($_REQUEST["food_menu"]);
$category = $_REQUEST["category"];

$query = "SELECT `Id` FROM `${food_menu}` WHERE `Name`='Name' AND `Ingridients`='Ingridients' LIMIT 1";
$result = mysqli_query($mysql_connection, $query);

if($result && mysqli_num_rows($result)) {
	echo "ERROR";
	exit();
}

mysqli_free_result($result);

$query = "INSERT INTO `${food_menu}`(`Id`, `Category`, `Name`, `Ingridients`) VALUES (NULL,'${category}','Name','Ingridients')";
$result = mysqli_query($mysql_connection, $query);

if($result) echo "OK";
else echo "ERROR";

?>