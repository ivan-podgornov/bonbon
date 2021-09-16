<?php
require_once "../../../scripts/app_config.php";

if (!is_user_admin() || !$_REQUEST["category"]) {
	echo "ERROR";
	exit();
}

$category = $_REQUEST["category"];
$query = "DELETE FROM `price-categories` WHERE `Category`='{$category}'";
$result = mysqli_query($mysql_connection, $query);

if (!$result) {
	echo "ERROR";
	exit();
}

$query = "DELETE FROM `price-list` WHERE `Category`='{$category}'";
mysqli_query($mysql_connection, $query);

echo "OK";
exit();