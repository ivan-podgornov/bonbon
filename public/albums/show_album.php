<?php
require_once "../../scripts/app_config.php";
$album_name = $_REQUEST["album"];
?>

<html lang="ru">
<?php show_head("Альбом \"${album_name}\""); ?>
<body>
	<?php show_header(); ?>
	<main>
		<article class="article layout-positioner">
			<header><h1 class="heading"><?php echo $album_name; ?></h1></header>
			<section>
				<?php show_album($album_name); ?>
			</section>
		</article>
	</main>
	<?php show_footer(); ?>
	<div class="photo-slider photo-slider_hidden">
		<div class="photo-slider__photo-container">
			<img class="photo-slider__photo" src="<?php echo "/images/albums/{$album_name}/photos/1.jpg"; ?>">
			<div class="photo-slider__info clearfix">
				<div class="photo-slider__album-name"></div>
				<div class="photo-slider__numbers">
					<span class="photo-slider__current"></span> из
					<span class="photo-slider__count"></span>
				</div>
			</div>
			<div class="photo-slider__arrows clearfix">
				<div class="photo-slider__arrow photo-slider__arrow_left slider__icon slider__icon_arrow_left">Назад</div>
				<div class="photo-slider__arrow photo-slider__arrow_right slider__icon slider__icon_arrow_right">Bперёд</div>
			</div>
			<div class="photo-slider__fading-circle photo-slider__fading-circle_hidden">
				<div class="photo-slider__circle1 photo-slider__circle"></div>
				<div class="photo-slider__circle2 photo-slider__circle"></div>
				<div class="photo-slider__circle3 photo-slider__circle"></div>
				<div class="photo-slider__circle4 photo-slider__circle"></div>
				<div class="photo-slider__circle5 photo-slider__circle"></div>
				<div class="photo-slider__circle6 photo-slider__circle"></div>
				<div class="photo-slider__circle7 photo-slider__circle"></div>
				<div class="photo-slider__circle8 photo-slider__circle"></div>
				<div class="photo-slider__circle9 photo-slider__circle"></div>
				<div class="photo-slider__circle10 photo-slider__circle"></div>
				<div class="photo-slider__circle11 photo-slider__circle"></div>
				<div class="photo-slider__circle12 photo-slider__circle"></div>
			</div>
		</div>
		<div class="photo-slider__close slider__icon slider__icon_close">Закрыть</div>
	</div>
	<?php show_scripts(); ?>
</body>

</html>