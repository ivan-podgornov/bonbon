<?php
require_once "../../../scripts/app_config.php";

if (!is_user_admin() || !$_REQUEST["coffee_name"] || !$_REQUEST["price"]) {
	echo "ERROR";
	exit();
}

$coffee_name = $_REQUEST["coffee_name"];
$price = $_REQUEST["price"];
$query = "UPDATE `coffee-card` SET `Price`='${price}' WHERE `Name`='${coffee_name}'";
$result = mysqli_query($mysql_connection, $query);

if (!$result) {
	echo "ERROR";
	exit();
}

echo "OK";
exit();