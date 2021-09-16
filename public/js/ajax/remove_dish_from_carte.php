<?php

require_once "../../../scripts/app_config.php";

if(!is_user_admin() || !$_REQUEST["food_menu"] || !$_REQUEST["category"] || !$_REQUEST["dish_name"]) {
	echo "ERROR";
	exit();
}

$food_menu = get_menu_name($_REQUEST["food_menu"]);
$category = $_REQUEST["category"];
$dish_name = $_REQUEST["dish_name"];

$query = "DELETE FROM `${food_menu}` WHERE `Category`='${category}' AND `Name`='${dish_name}'";
$result = mysqli_query($mysql_connection, $query);

if($result) echo "OK";
else echo "ERROR";

?>