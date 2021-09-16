<?php

require_once "../scripts/app_config.php";
$images = array("images/food-menu-slider/2.jpg", "images/food-menu-slider/1.jpg", "images/food-menu-slider/3.jpg");

?>

<html lang="ru">
<?php show_head("Детское меню") ?>
<body>
<?php show_header($images); ?>
<main>
	<article class="article layout-positioner">
		<header><h1 class="heading">Детское меню</h1></header>
		<section class="clearfix">
			<?php show_menu("children"); ?>
		</section>
	</article>
</main>
<?php show_footer(); ?>
<?php show_scripts(); ?>
</body>

</html>