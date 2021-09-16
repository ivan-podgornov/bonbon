<?php
require_once "../../../scripts/app_config.php";

if (!is_user_admin() || !$_REQUEST["category"] || !$_REQUEST["name"]) {
	echo "ERROR";
	exit();
}

$category = $_REQUEST["category"];
$name = $_REQUEST["name"];

$query = "SELECT `Id` FROM `price-list` WHERE `Category`='${category}' AND `Value1`='${name}' LIMIT 1";
$result = mysqli_query($mysql_connection, $query);

if (!$result || mysqli_num_rows($result)) {
	echo "ERROR";
	exit();
}
mysqli_free_result($result);

$query = "SELECT `Count` FROM `price-categories` WHERE `Category`='${category}' LIMIT 1";
$result = mysqli_query($mysql_connection, $query);

if ($result && mysqli_num_rows($result)) {
	$row = mysqli_fetch_row($result);
	$count = (int) $row[0] + 1;
	$query = "UPDATE `price-categories` SET `Count`='${count}' WHERE `Category`='${category}'";
	mysqli_query($mysql_connection, $query);
} else {
	$query = "INSERT INTO `price-categories` (Category, Count) VALUES ('${category}', '1')";
	mysqli_query($mysql_connection, $query);
}

if ($result && mysqli_num_rows($result)) $query = "INSERT INTO `price-list` (Category, Value1, Value2, Value3) VALUES ('${category}', '${name}', 'Значение-1', 'Значение-2')";
else $query = "INSERT INTO `price-list` (Category, Value1, Value2, Value3) VALUES ('${category}', '${name}', 'Значение-2', 'Значение-3')";

mysqli_free_result($result);
$result = mysqli_query($mysql_connection, $query);

if (!$result) {
	echo "ERROR";
	exit();
}

echo "OK";
exit();