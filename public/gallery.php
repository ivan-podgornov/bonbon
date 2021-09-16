<?php require_once "../scripts/app_config.php"; ?>

<html lang="ru">
<?php show_head("Фото") ?>
<body>
<?php show_header(); ?>
<main>
	<article class="article layout-positioner">
		<header><h1 class="heading">Фото</h1></header>
		<?php show_gallery(); ?>
	</article>
</main>
<?php show_footer(); ?>
<?php show_scripts(); ?>
</body>

</html>