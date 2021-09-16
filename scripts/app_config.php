<?php

define("DOMAIN", "bonbon.loc");
define("ADMIN_PASSWORD", "bonbon4ik92378");
define("MYSQL_HOST", "localhost");
define("MYSQL_USER", "root");
define("MYSQL_PASSWORD", "");
define("MYSQL_DATABASE", "bonbon");
define("PATCH", "3");

$mysql_connection = mysqli_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);

function is_user_admin() {
	if($_COOKIE["igorek"] === "true") return true;
	return false;
}

function show_album($name) {
	$album = get_album_by_name($name);
	if (!$album) { echo "Альбома с таким именем не существует"; return false; }

	$photos = get_photos_from_album($album);

	echo "<ul class=\"features album-photos\" data-album-name=\"${name}\">";
	foreach ($photos as $photo) {
		$source = $photo["img"]["L"]["href"];
		$origin = $photo["img"]["orig"]["href"];
		$self = $photo["links"]["self"]; ?>

		<li class="features__feature album-photos__item"> <?php
			$document = new DOMDocument("1.0", "utf-8");
			$image = $document->createElement("img");
			$image->setAttribute("class", "album-photos__photo");
			$image->setAttribute("src", "${source}");
			$image->setAttribute("data-origin", "${origin}");

			if (is_user_admin()) $image->setAttribute("data-self", "${self}");

			$document->appendChild($image);
			echo $document->saveHTML();
		?>
		</li><?php
	}
	echo "</ul>";
}

function show_gallery() {
	$albums = get_albums();

	echo "<section class=\"features\">";
	foreach ($albums as $album) {
		$image_link = $album["img"]["S"]["href"];
		$encode_name = urlencode($album["title"]); ?>
		<a class="features__feature album" href="<?php echo "/albums/${encode_name}"; ?>">
			<img class="album__cover" src="<?php echo preg_replace('/S$/', "M", $image_link, 1); ?>">
			<div class="album__name">
				<?php echo $album["title"]; ?>
				<span class="album__count-photo"><?php echo $album["imageCount"]; ?></span>
			</div>
		</a>
	<?php }
	echo "</section>";
}

function get_albums() {
	$user_name = "bonbon-lg";

	$query_url = "http://api-fotki.yandex.ru/api/users/${user_name}/";
	$query_context = stream_context_create(array(
		"http" => array(
			"method" => "GET",
			"header" => "Accept: application/json"
		)
	));

	$json = file_get_contents($query_url, false, $query_context);
	$service_document = json_decode($json, true);
	$album_list_link = $service_document["collections"]["album-list"]["href"];

	$query_url = $album_list_link . "?limit=100";
	$json = json_decode(file_get_contents($query_url, false, $query_context), true);

	return $json["entries"];
}

function get_album_by_name($album_name) {
	$albums = get_albums();

	foreach ($albums as $album) {
		if ($album["title"] === $album_name) return $album["links"]["photos"];
	}

	return false;
}

function get_photos_from_album($album) {
	$query_url = $album;
	$query_context = stream_context_create(array(
		"http" => array(
			"method" => "GET",
			"header" => "Accept: application/json; type=entry"
		)
	));
	$json = json_decode(file_get_contents($query_url, false, $query_context), true);
	return $json["entries"];
}

function show_animations() {
	global $mysql_connection;
	$query = "SELECT `Animation` FROM `animations` WHERE 1";
	$result = mysqli_query($mysql_connection, $query);

	$ul = "<ul";
	if (is_user_admin()) $ul .= " class=\"animations__list\"";
	$ul .= ">";

	echo $ul;
	while ($row = mysqli_fetch_row($result)) {
		$li = "<li";
		if (is_user_admin()) $li .= " class=\"animations__animation\"";
		$li .= ">";

		if (is_user_admin()) {
			$li .= "<span class=\"animations__name\">${row[0]}</span>";
			$li .= "<span class=\"animations__remove admin-action admin-action_remove\">-</span>";
		} else {
			$li .= "${row[0]}";
		}

		$li .= "</li>";
		echo $li;
	}
	echo "</ul>";
}

function get_menu_name($name) {
	$menus = array(
		"Меню" => "adults-menu",
		"Детское меню" => "children-menu",
		"Банкетное меню" => "banquet-menu"
	);

	return $menus[$name];
}

function show_price_list () {
	show_single_categories();
	show_other_categories();
	return;
}

function show_single_categories () {
	global $mysql_connection;
	$result = mysqli_query($mysql_connection, "SELECT `Category` FROM `price-categories` WHERE `Count`='1'");

	if (!$result || !mysqli_num_rows($result)) return;

	$query = "SELECT `Category`, `Value1`, `Value2`, `Value3` FROM `price-list` WHERE";
	for ($i = 0; $row = mysqli_fetch_row($result) ; $i++) {
		if ($i !== 0) $query .= " OR";
		$query .= " `Category`='${row[0]}'";
	}
	mysqli_free_result($result);

	$result = mysqli_query($mysql_connection, $query);

	if (!$result || !mysqli_num_rows($result)) return;

	echo "<section class=\"price-table__container\">";
	show_price_table(createRowsArray($result));
	echo "</section>";

	return;
}

function show_other_categories () {
	global $mysql_connection;
	$result = mysqli_query($mysql_connection, "SELECT `Category` FROM `price-categories` WHERE `Count`>'1'");

	if (!$result || !mysqli_num_rows($result)) return;

	for ($i = 0; $row = mysqli_fetch_row($result); $i++) {
		$query = "SELECT `Value1`, `Value2`, `Value3` FROM `price-list` WHERE `Category`='${row[0]}'";
		$price_row = mysqli_query($mysql_connection, $query);
		$section = "<section class=\"price-table__container";
		if (is_user_admin()) $section .= " admin-price-category";
		$section .= "\">";
		echo $section;

		$h2 = "<h2 class=\"price-table__caption";
		if (is_user_admin()) $h2 .= " admin-price-table__caption";
		$h2 .= "\">";

		if (is_user_admin()) {
			$h2 .= "<span class=\"admin-price-table__category\">${row[0]}</span>";
			$h2 .= "<div class=\"admin-price-table__add admin-action admin-action_add\">+</div>";
			$h2 .= "<div class=\"admin-price-table__remove admin-action admin-action_remove\">-</div>";
		} else {
			$h2 .= "${row[0]}";
		}

		$h2 .= "</h2>";
		echo $h2;

		show_price_table(createRowsArray($price_row));
		echo "</section>";
		mysqli_free_result($price_row);
	}

	return;
}

function show_price_table($rows) {
	$count_columns = getMaxInStepsArray($rows);

	$table = "<table class=\"price-table";
	if (is_user_admin()) $table .= " admin-price-table";
	$table .= "\">";

	for ($i = 0; $i < count($rows); $i++) {
		$tr = "<tr class=\"price-table__row";
		if (is_user_admin()) $tr .= " admin-price-table__row";
		$tr .= "\">";

		for ($j = 0, $len = count($rows[$i]); $j < $len; $j++) {
			$td = "<td class=\"price-table__cell";
			if (is_user_admin()) $td .= " admin-price-table__cell";
			if ($j !== 0) $td .= " price-table__value";
			if ($j === 0 && $len < $count_columns) {
				$colspan = $count_columns - $len + 1;
				$td .= "\" colspan=\"${colspan}";
			}
			$value = $rows[$i][$j];
			$td .= "\">${value}</td>";
			$tr .= $td;
		}

		$tr .= "</tr>";
		$table .= $tr;
	}

	$table .= "</table>";
	echo $table;
	return;
}

function createRowsArray($mysqli_result) {
	$rows = array();
	for ($i = 0; $row = mysqli_fetch_row($mysqli_result); $i++) {
		$result_row = array();
		for ($j = 0; $j < count($row); $j++) {
			if ($row[$j] !== null && $row[$j] !== '') $result_row[$j] = $row[$j];
		}
		$rows[$i] = $result_row;
	}
	return $rows;
}

function getMaxInStepsArray($array) {
	$max = count($array[0]);
	for ($i = 1; $i < count($array); $i++) {
		$count = count($array[$i]);
		if ($count > $max) $max = $count;
	}

	return $max;
}

function show_menu($menu) {
	if($menu === "adults") {
		$categories = array(
			"Холодные закуски" => "cold-snacks", "Салаты" => "salads", "Горячие закуски" => "hot-snacks",
			"Первые блюда" => "first-dishes", "Блюда из свинины" => "pork-dishes", "Блюда из курицы" => "chicken-dishes",
			"Гарниры" => "garnishes", "Соусы" => "sauces", "Десерты" => "desserts",
			"Фруктовые закуски" => "fruit-snacks", "Сезонные фрукты" => "season-fruit", "Мороженое" => "ice-cream",
			"Пицца" => "pizza", "Пицца \"Сделай сам\"" => "pizza-diy"
		);
	} else { // Если не adult's, значит 100% детское
		$categories = array(
			"Салаты и закуски" => "salads",
			"Пицца" => "pizza",
			"Пицца \"Сделай сам\"" => "pizza-diy",
			"Bторые блюда" => "main-courses",
			"Первые блюда" => "first-dishes",
			"Напитки" => "drinks",
			"Десерты" => "deserts"
		);
	}

	$i = 12;

	echo "<ul class=\"food-menu\">";
	foreach ($categories as $category => $en) {
		echo "<li class=\"food-menu__item\" tabindex=\"${i}\">${category}";
		echo "<div class=\"food-menu__triangle ${menu}-icon ${menu}-icon_${en}\"></div>";
		show_carte($menu, $category);
		echo "</li>";
		$i++;
	}
	echo "</ul>";
}

function show_carte($menu, $category_name) {
	global $mysql_connection;
	$query = "SELECT * FROM `${menu}-menu` WHERE `Category`='${category_name}';";

	if($result = mysqli_query($mysql_connection, $query)) {
		if($menu === "adults" || $menu === "children") $carte = "<div class=\"food-menu__carte carte";
		else $carte = "<div class=\"carte";

		if(is_user_admin()) $carte .= " admin-carte";
		$carte .= "\">";
		echo $carte;

		echo "<h2 class=\"carte__caption\">${category_name}</h2>";
		echo "<ul class=\"carte__list\">";
		while($row = mysqli_fetch_assoc($result)) {
			$str = "<li class=\"carte__list-item";
			if(is_user_admin()) $str .= " admin-carte__list-item";

			$str .= "\"><span class=\"carte__dish-name\">${row['Name']}</span>";

			if($row["Ingridients"] !== null && $row["Ingridients"] !== "NULL") {
				$str .= "<span class=\"carte__ingridients\">${row['Ingridients']}</span>";
			}
			if(is_user_admin()) $str .= "<div class=\"admin-carte__remove admin-action admin-action_remove\">-</div>";

			$str .= "</li>";
			echo $str;
		}

		echo "</ul>";
		if(is_user_admin()) {
			echo "<div class=\"admin-carte__add admin-action admin-action_add\">+</div>";
		}
		echo "</div>";
	}
	mysqli_free_result($result);
}

function show_head($title) {?>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<meta name="yandex-verification" content="f0cfb7817523f7e9" />
		<title><?php echo $title; ?></title>
		<?php
			echo "<link rel=\"shortcut icon\" href=\"/favicon.ico?" . PATCH . "\" type=\"image/x-icon\">";
			echo "<link rel=\"stylesheet\" href=\"/css/normalize.css?" . PATCH . "\">";
			echo "<link rel=\"stylesheet\" href=\"/css/fonts.css?" . PATCH . "\">";
			echo "<link rel=\"stylesheet\" href=\"/css/style.css?" . PATCH . "\">";
		?>
		<?php if(is_user_admin()) {
			echo "<link rel=\"stylesheet\" href=\"/css/admin.css?" . PATCH . "\">";
		} ?>
		<!--[if lt IE 9]>
			<script src="/js/html5shiv.js"></script>
			<script src="/js/es5-shim.js"></script>
		<![endif]-->
	</head><?php
}

function show_scripts() {
	echo "<script defer src=\"/js/photo-slider.js?" . PATCH . "\"></script>";
	echo "<script defer src=\"/js/script.js?" . PATCH . "\"></script>";
	if(is_user_admin()) echo "<script defer src=\"/js/admin.js?" . PATCH . "\"></script>";
}

function show_footer() {
	?><footer class="footer">
		<div class="contacts">
			<article class="layout-positioner">
				<header><h2 class="contacts__heading heading">Контакты</h2></header>
				<section>
					<p class="contacts__paragraph paragraph">
						<span class="contacts__phone-number">+38-095-322-26-43</span>
	ул. Градусова, 4а (напротив 25 школы)
					</p>
				</section>
			</article>
			<article class="layout-positioner">
				<header><h2 class="contacts__heading heading">Режим работы</h2></header>
				<section>
					<p class="contacts__paragraph paragraph">Мы работаем ежедневно с 10:00 до 20:00</p>
				</section>
			</article>
		</div>
		<p class="copyright heading">© Bonbon 2016</p>
	</footer>
	<?php
	if(is_user_admin()) { ?>
		<div class="admin-confirm__container admin-confirm_hidden">
			<div class="admin-confirm">
				<div class="admin-confirm__message"></div>
				<div class="admin-confirm__button admin-confirm__button_ok">Да</div>
				<div class="admin-confirm__button admin-confirm__button_cancel">Нет</div>
			</div>
		</div>
		<div class="admin-alert admin-alert_hidden"></div>
		<div class="admin-prompt__container admin-prompt_hidden">
			<div class="admin-prompt">
				<div class="admin-prompt__message">Введите новое название блюда</div>
				<input class="admin-prompt__input" type="text">
				<div class="admin-prompt__button admin-prompt__button_ok">Ок</div>
				<div class="admin-prompt__button admin-prompt__button_cancel">Отмена</div>
			</div>
		</div>
	<?php }
}

function show_header($images = array("/images/index-slider/2.jpg", "/images/index-slider/1.jpg", "/images/index-slider/3.jpg")) {
	?><header class="page-header">
		<div class="topbar">
			<div class="layout-positioner clearfix">
				<figure class="logo"><a class="logo__link" href="/index.php">Bonbon</a></figure>
				<nav class="navigation">
					<ul class="main-menu">
						<li class="main-menu__item"><a class="main-menu__link main-menu__icon icon icon_home" href="/index.php" tabindex="2">Главная</a></li>
						<li class="main-menu__item main-menu__item-submenu">
							<span class="main-menu__link main-menu__icon icon icon_menu main-menu__submenu-container main-menu__submenu-container_active" tabindex="3">Меню</span>
							<ul class="main-menu__submenu">
								<li class="submenu__item"><a class="main-menu__link main-menu__submenu-link" href="/adult's-menu" tabindex="4">Bзрослое</a></li>
								<li class="submenu__item"><a class="main-menu__link main-menu__submenu-link" href="/banquet-menu" tabindex="5">Банкетное</a></li>
								<li class="submenu__item"><a class="main-menu__link main-menu__submenu-link" href="/children's-menu" tabindex="6">Детское</a></li>
								<li class="submenu__item"><a class="main-menu__link main-menu__submenu-link" href="/coffee-card" tabindex="8">Кофейная карта</a></li>
							</ul>
						</li>
						<li class="main-menu__item"><a class="main-menu__link main-menu__icon icon icon_animations" href="/animations" tabindex="9">Анимации</a></li>
						<li class="main-menu__item"><a class="main-menu__link main-menu__icon icon icon_photos" href="/gallery" tabindex="10">Фото</a></li>
						<li class="main-menu__item"><a class="main-menu__link main-menu__icon icon icon_price-list" href="/price-list" tabindex="11">Прайс-лист</a></li>
					</ul>
				</nav>
			</div>
		</div>
		<?php if (count($images)) {
			$count = count($images);
			$number_active = round($count / 2, 0, PHP_ROUND_HALF_DOWN); ?>
			<div class="slider">
				<div class="slider__images-container">
					<ul class="slider__images" style="<?php echo "margin-left: " . (string) ($number_active * 100 * -1) . "%"; ?>"><?php
						for ($i = 0; $i < $count; $i++) {
							echo "<li class=\"slider__item\"><img class=\"slider__image\" src=\"${images[$i]}\"></li> ";
						}
					?>
					</ul>
				</div>
				<ul class="slider__rounds" ><?php
					for ($i = 0; $i < $count; $i++) {
						$li = "<li class=\"slider__round";
						if ($i == $number_active) $li .= " slider__round_active";
						$li .= "\"></li>";
						echo $li;
					} ?>
				</ul>
				<div class="slider__arrow slider__arrow_left slider__icon slider__icon_arrow_left"></div>
				<div class="slider__arrow slider__arrow_right slider__icon slider__icon_arrow_right"></div>
			</div>
		<?php } ?>
	</header><?php
}

?>