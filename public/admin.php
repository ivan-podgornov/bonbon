<?php

require_once "../scripts/app_config.php";

$is_logged = is_user_admin();

if($_SERVER["REQUEST_METHOD"] === "POST") {
	$error = "";
	$password = $_REQUEST["password"];

	if($password !== ADMIN_PASSWORD) $error = "Вы ввели неверный пароль";
	else {
		setcookie("igorek", "true", time() + 3600 * 24 * 30);
		$is_logged = true;
	}
}
else if($_REQUEST["act"] === "logout") {
	setcookie("igorek", "", time() - 3600);
	header("location: admin.php");
}

?>

<html lang="ru">
<?php show_head("Панель администратора") ?>
<body>
<?php show_header(); ?>
<main>
	<?php if(!$is_logged) {?>
		<form class="admin-login article layout-positioner" action="admin.php" method="POST">
			<h1 class="heading">Панель администратора</h1>
			<?php if($_SERVER["REQUEST_METHOD"] === "POST" && strlen($error) !== 0) {
				echo "<span class=\"admin-login__error\">${error}</span>";
			}?>
			<label class="admin-login__label clearfix">
				<span class="admin-login__key">Bведите пароль:</span>
				<input class="admin-login__input" type="password" name="password">
			</label>
			<input class="admin-login__button" type="submit" value="Bойти">
		</form>
	<?php } else { ?>
		<article class="admin-login article layout-positioner">
			<a href="admin.php?act=logout" class="admin-login__button">Bыйти</a>
		</article>
	<?php } ?>
</main>
<?php show_footer(); ?>
<?php show_scripts(); ?>
</body>

</html>