<?php

require_once "../scripts/app_config.php";
$images = array("/images/coffee-card-slider/1.jpg", "/images/coffee-card-slider/2.jpg", "/images/coffee-card-slider/3.jpg");
?>

<html lang="ru">
<?php show_head("Кофейная карта") ?>
<body>
<?php show_header($images); ?>
<main>
	<article class="article layout-positioner">
		<header><h1 class="heading">Кофейная карта</h1></header>
		<section class="features coffee-card">
			<?php
				$query = "SELECT `Name`, `Price` FROM `coffee-card` WHERE 1";
				$result = mysqli_query($mysql_connection, $query);
				while ($row = mysqli_fetch_row($result)) { ?>
					<figure class="features__feature coffee-card__card">
						<img class="coffee-card__image" src="<?php echo "images/${row[0]}.jpg"; ?>" alt="<?php echo "${row[0]}"; ?>">
						<div class="coffee-card__price"><?php echo "${row[1]}"; ?></div>
						<figcaption class="coffee-card__caption"><?php echo "${row[0]}"; ?></figcaption>
					</figure>
				<?php }
			?>
		</section>
	</article>
</main>
<?php show_footer(); ?>
<?php show_scripts(); ?>
</body>

</html>