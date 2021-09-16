<?php

require_once "../scripts/app_config.php";

?>

<html lang="ru">
<?php show_head("Прайс-лист") ?>
<body>
<?php show_header(); ?>
<main>
	<?php if (is_user_admin()) { ?>
		<article class="article layout-positioner admin-price-list">
			<header>
				<h1 class="heading">
					<span>Прайс-лист</span>
					<span class="admin-price-list__add admin-action admin-action_add">+</span>
					<span class="admin-price-list__remove admin-action admin-action_remove">-</span>
				</h1>
			</header>
			<?php show_price_list() ?>
		</article>
	<?php } else { ?>
		<article class="article layout-positioner">
			<header><h1 class="heading">Прайс-лист</h1></header>
			<?php show_price_list() ?>
		</article>
	<?php } ?>
</main>
<?php show_footer(); ?>
<?php show_scripts(); ?>
</body>

</html>