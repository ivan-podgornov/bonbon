<?php

require_once "../scripts/app_config.php";

?>

<html lang="ru">
<?php show_head("Кафе Bonbon") ?>
<body>
    <?php show_header(); ?>
	<main>
		<article class="article layout-positioner">
			<header><h1 class="heading">Кафе Bonbon</h1></header>
			<section>
				<p class="paragraph">Отличное детское кафе, которое понравится как родителям, так и детям. У нас есть
					несколько залов. Один из них стилизован и предназначен только для детей. В нём  разрисованы стены,
					цветной потолок, маленькие домики и игрушки. Так же имеется отдельное детское меню.</p>
				<p class="paragraph">Второй зал - банкетный, он вмещает в себя до  30 человек. Здесь вы можете отметить
					какой-нибудь праздник, свадьбу или корпоратив. Для банкетов тоже есть отдельное меню.</p>
				<p class="paragraph">В обычном зале вы можете просто отдохнуть.  Вас порадует ассортимент блюд и закусок
					Итальянской и Европейской кухонь. Для тех кто решил провести вечернюю прогулку, кафе Воnbоn
					предлагает открытую террасу, рядом с которой находится детская площадка.</p>
			</section>
		</article>
		<article class="article layout-positioner">
			<header><h1 class="heading">Для детей</h1></header>
			<section class="features">
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/animations.jpg" alt="Аниматорша Вика">
					<figcaption class="children-service__name">Анимации</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/aqua-makeup.jpg" alt="Аквагрим">
					<figcaption class="children-service__name">Аквагрим</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/candy-bar.jpg" alt="Candy Bar">
					<figcaption class="children-service__name">Candy Bar</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/soap-bubbles-show.jpg" alt="Шоу мыльных пузырей">
					<figcaption class="children-service__name">Шоу мыльных пузырей</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/science-show.jpg" alt="Научное шоу">
					<figcaption class="children-service__name">Научное шоу</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/liquid-nitrogen-show.jpg" alt="Шоу с жидким азотом">
					<figcaption class="children-service__name">Шоу с жидким азотом</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/paper-show.jpg" alt="Бумажное шоу">
					<figcaption class="children-service__name">Бумажное шоу</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/cakes.jpg" alt="Торт">
					<figcaption class="children-service__name">Торты под заказ</figcaption>
				</figure>
				<figure class="features__feature children-service">
					<img class="children-service__image" src="images/baloons.jpg" alt="Зал с воздушными шарами">
					<figcaption class="children-service__name">Оформление зала воздушными шарами</figcaption>
				</figure>
			</section>
		</article>
	</main>
	<?php show_footer(); ?>
	<?php show_scripts(); ?>
</body>

</html>