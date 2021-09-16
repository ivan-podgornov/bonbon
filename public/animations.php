<?php

require_once "../scripts/app_config.php";

?>

<html lang="ru">
<?php show_head("Анимации") ?>
<body>
<?php show_header(); ?>
<main>
	<article class="article animations layout-positioner">
		<?php if (is_user_admin()) { ?>
			<header>
				<h1 class="heading">
					<span>Анимации</span>
					<span class="animations__add admin-action admin-action_add">+</span>
				</h1>
			</header>
		<?php } else {?>
			<header><h1 class="heading">Анимации</h1></header>
		<?php } ?>

		<section>
			<?php show_animations() ?>
		</section>
	</article>
</main>
<?php show_footer(); ?>
<?php show_scripts(); ?>
</body>

</html>