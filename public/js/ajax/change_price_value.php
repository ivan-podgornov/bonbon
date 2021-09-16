<?php
require_once "../../../scripts/app_config.php";

if (
	!is_user_admin()
	|| !$_REQUEST["category"]
	|| !$_REQUEST["name"]
	|| !$_REQUEST["number_value"]
	|| !$_REQUEST["old_value"]
) {
	echo "ERROR";
	exit();
}

$category = $_REQUEST["category"];
$name = $_REQUEST["name"];
$number_value = "Value" . $_REQUEST["number_value"];
$old_value = $_REQUEST["old_value"];
$new_value = $_REQUEST["new_value"];

if ($number_value === "Value1" && $new_value === "") {
	echo "ERROR";
	exit();
}

$query = "UPDATE `price-list` SET `${number_value}`='${new_value}' WHERE `Value1`='${name}' AND `Category`='${category}'";
$result = mysqli_query($mysql_connection, $query);

if (!$result) {
	echo "ERROR";
	exit();
}

if ($number_value !== "Value3" && $new_value === "") {
	$number = (int) $_REQUEST["number_value"];
	$new_number = $number + 1;

	while ($number < 3) {
		$new_number = $number + 1;
		$query = "SELECT `Value${new_number}` FROM `price-list` WHERE `Value1`='${name}' AND `Category`='${category}'";
		$result = mysqli_query($mysql_connection, $query);
		$row = mysqli_fetch_row($result);
		mysqli_free_result($result);
		$query = "UPDATE `price-list` SET `Value${number}`='${row[0]}' WHERE `Value1`='${name}' AND `Category`='${category}'";
		mysqli_query($mysql_connection, $query);
		$number++;
	}

	$query = "UPDATE `price-list` SET `Value${new_number}`=NULL WHERE  `Value1`='${name}' AND `Category`='${category}'";
	mysqli_query($mysql_connection, $query);
}

echo "OK";
exit();