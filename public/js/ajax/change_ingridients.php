<?php

require_once "../../../scripts/app_config.php";

if(!is_user_admin()
	|| !$_REQUEST["food_menu"]
	|| !$_REQUEST["category"]
	|| !$_REQUEST["dish_name"]) {

	echo "ERROR";
	exit();
}

$food_menu = get_menu_name($_REQUEST["food_menu"]);
$category = $_REQUEST["category"];
$dish_name = $_REQUEST["dish_name"];
$new_ingridients = ($_REQUEST["new_ingridients"]) ? $_REQUEST["new_ingridients"] : "NULL";

$query = "UPDATE `${food_menu}` SET `Ingridients`='${new_ingridients}' WHERE `Category`='${category}' AND `Name`='${dish_name}'";
$result = mysqli_query($mysql_connection, $query);

if($result) echo "OK";
else echo "ERROR";

?>