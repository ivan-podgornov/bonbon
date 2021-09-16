<?php
require_once "../../../scripts/app_config.php";

if (!is_user_admin() || !$_REQUEST["category"] || !$_REQUEST["name"]) {
	echo "ERROR";
	exit();
}

$category = $_REQUEST["category"];
$name = $_REQUEST["name"];

$query = "SELECT `Count` FROM `price-categories` WHERE `Category`='${category}' LIMIT 1;";
$result = mysqli_query($mysql_connection, $query);

if (!$result || !mysqli_num_rows($result)) {
	echo "ERROR";
	exit();
}

$row = mysqli_fetch_row($result);
mysqli_free_result($result);
$count = (int) $row[0];

if ($count === 1) {
	$query = "DELETE FROM `price-categories` WHERE `Category`='${category}'";
	mysqli_query($mysql_connection, $query);
	$query = "DELETE FROM `price-list` WHERE `Category`='${category}'";
} else {
	$count -= 1;
	$query = "UPDATE `price-categories` SET `Count`='${count}' WHERE `Category`='${category}'";
	mysqli_query($mysql_connection, $query);
	$query = "DELETE FROM `price-list` WHERE `Category`='${category}' AND `Value1`='${name}' LIMIT 1";
}

$result = mysqli_query($mysql_connection, $query);
if (!$result) {
	echo "ERROR";
	exit();
}

echo "OK";
exit();