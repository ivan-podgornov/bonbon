<?php
require_once "../../../scripts/app_config.php";

if(!is_user_admin()
	|| !$_REQUEST["food_menu"]
	|| !$_REQUEST["category"]
	|| !$_REQUEST["dish_name"]
	|| $_REQUEST["old_position"] === ''
	|| $_REQUEST["old_position"] === null
	|| $_REQUEST["new_position"] === ''
	|| $_REQUEST["new_position"] === null) {

	exit();
}

$food_menu = get_menu_name($_REQUEST["food_menu"]);
$category = $_REQUEST["category"];
$dish_name = $_REQUEST["dish_name"];
$old_position = $_REQUEST["old_position"];
$new_position = $_REQUEST["new_position"];

$desc = $old_position > $new_position; // true если старая позиция больше новой, false - если меньше
$count = ($desc) ? $old_position - $new_position : $new_position - $old_position;

$query = "SELECT * FROM `{$food_menu}` WHERE `Name`='${dish_name}' AND `Category`='${category}' LIMIT 1";
$result = mysqli_query($mysql_connection, $query);

if(!$result) {
	echo "ERROR";
	exit();
}

$tmp_dish = mysqli_fetch_assoc($result);
$current_id = $tmp_dish["Id"];
mysqli_free_result($result);

$query = "DELETE FROM `${food_menu}` WHERE `Id`='${current_id}'";
mysqli_query($mysql_connection, $query);

for($i = 0; $i < $count; $i++) {
	$query = ($desc) ? "SELECT `Id` FROM `${food_menu}` WHERE `Category`='${category}' AND `Id`<'${current_id}' ORDER BY `Id` DESC LIMIT 1" :
		"SELECT `Id` FROM `${food_menu}` WHERE `Category`='${category}' AND `Id`>'${current_id}' LIMIT 1";

	$arr = mysqli_fetch_assoc(mysqli_query($mysql_connection, $query));
	$new_id = $arr["Id"];

	$query = "UPDATE `${food_menu}` SET `Id`='${current_id}' WHERE `Id`='${new_id}'";
	mysqli_query($mysql_connection, $query);
	$current_id = $new_id;
}

$query = "INSERT INTO `${food_menu}` (`Id`, `Category`, `Name`, `Ingridients`) VALUES ('${current_id}', '${tmp_dish['Category']}', '${tmp_dish['Name']}', '${tmp_dish['Ingridients']}')";
mysqli_query($mysql_connection, $query);
echo "OK";

?>