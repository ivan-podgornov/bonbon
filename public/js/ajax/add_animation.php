<?php
require_once "../../../scripts/app_config.php";

if (!is_user_admin() || !$_REQUEST["name"]) {
	echo "ERROR";
	exit();
}

$name = $_REQUEST["name"];
$query = "SELECT `Id` FROM `animations` WHERE `Animation`='${name}'";
$result = mysqli_query($mysql_connection, $query);
if (!$result || mysqli_num_rows($result)) {
	echo "ERROR";
	exit();
}
mysqli_free_result($result);

$query = "INSERT INTO `animations` (Animation) VALUES ('${name}')";
$result = mysqli_query($mysql_connection, $query);
if (!$result) {
	echo "ERROR";
	exit();
}

echo "OK";
exit();