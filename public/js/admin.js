'use strict';

function AdminAnimations(elem) {
	'use strict';
	this.elem = elem;
	this.list = elem.querySelector('.animations__list');
	this.animations = this.getAnimations();
	this.elem.addEventListener('click', this.onClick.bind(this));
}

AdminAnimations.prototype.onClick = function(event) {
	'use strict';
	event = event || window.event;
	var target = event.target || event.srcElement;
	var that = this;

	if (target.classList.contains('animations__add')) {
		prompt(
			'Введите название анимации',
			function (text) { that.addAnimation(text); },
			function () { return false; }
		);
		return true;
	}

	if (target.classList.contains('animations__remove')) {
		var name = target.parentElement.querySelector('.animations__name').textContent;
		confirm(
			'Вы уверены, что хотите удалить "' + name + '"?',
			function() { that.removeAnimation(name); },
			function() { return false; }
		);
		return true;
	}

	return false;
};

AdminAnimations.prototype.addAnimation = function(name) {
	'use strict';
	var that = this;

	if (!name.length) {
		alert('Минимальная длина названия анимации: 3 символа');
		return false;
	}

	if (this.animations.indexOf(name) !== -1) {
		alert('Такая анимация уже существует');
		return false;
	}

	ajaxAddAnimation();

	function add() {
		that.list.appendChild(createAnimationElem());
		that.animations.push(name);
	}

	function ajaxAddAnimation() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/add_animation.php?name=' + encodeURIComponent(name), true);
		xhr.send();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return false;
			if (xhr.responseText === 'OK') add();
		};
	}

	function createAnimationElem() {
		var li = document.createElement('li');
		li.className = 'animations__animation';

		var nameEl = document.createElement('span');
		nameEl.className = 'animations__name';
		nameEl.textContent = name;
		li.appendChild(nameEl);

		var removeButton = document.createElement('span');
		removeButton.className = 'animations__remove admin-action admin-action_remove';
		removeButton.textContent = '-';
		li.appendChild(removeButton);

		return li;
	}
};

AdminAnimations.prototype.removeAnimation = function(name) {
	'use strict';
	if (!name.length) {
		alert('Минимальная длина названия анимации: 3 символа');
		return false;
	}

	var animationsNumber = this.animations.indexOf(name);
	if (animationsNumber === -1) {
		alert('Анимации с таким именем не существует');
		return false;
	}

	var that = this;
	ajaxRemoveAnimation();

	function ajaxRemoveAnimation() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/remove_animation.php?name=' + encodeURIComponent(name), true);
		xhr.send();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return false;
			if (xhr.responseText === 'OK') remove();
		};
	}

	function remove() {
		that.list.removeChild(that.list.children[animationsNumber]);
		that.animations.splice(animationsNumber, 1);

		return true;
	}
};

AdminAnimations.prototype.getAnimations = function() {
	'use strict';
	var list = this.list;
	var animations = [];

	for (var i = 0; i < list.children.length; i++) {
		animations.push(list.children[i].querySelector('.animations__name').textContent);
	}

	return animations;
};

function AdminCarte(carte) {

	this.carte = carte;

	this.carte.addEventListener('click', this.onClick.bind(this));
	this.carte.addEventListener('dblclick', this.onDoubleClick.bind(this));

	if(carte.querySelector('.carte__list').children.length < 2) return;

	this.carte.addEventListener('mousedown', function(event) {
		event = event || window.event;
		var target = event.target || event.srcElement;

		if(event.which !== 1) return; // Перетаскивать можно только левой кнопкой мыши
		if(!target.classList.contains('admin-carte__list-item')) return; // Перетаскивать можно только элементы списка

		var dragObject = {
			elem: target,
			backgroundColor: getComputedStyle(target).backgroundColor,
			shiftY: event.clientY - target.getBoundingClientRect().top,
			parentTop: target.parentElement.getBoundingClientRect().top + pageYOffset,
			lastNextItem: null
		};

		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', mouseUp);

		event.preventDefault();

		function mouseMove(event) {
			if(!dragObject.start) {
				var moveY = event.clientY - target.getBoundingClientRect().top - dragObject.shiftY;
				if(Math.abs(moveY) < 3) return; // Мышь не передвинулась достаточно далеко

				dragObject.elem.style.width = 'calc(100% - 80px)';
				dragObject.elem.style.backgroundColor = dragObject.backgroundColor;
				dragObject.elem.style.left = 0;
				dragObject.elem.style.top = dragObject.elem.offsetTop + 'px';
				dragObject.elem.style.position = 'absolute';
				dragObject.elem.style.zIndex = '32';

				dragObject.start = true;
			}

			dragObject.elem.style.top = event.pageY - dragObject.parentTop - dragObject.shiftY;

			var nextItem = findNextElem();
			var parent = dragObject.elem.parentElement;
			var height = dragObject.elem.offsetHeight;

			var first = (dragObject.elem === parent.firstElementChild) ? parent.children[1] : parent.firstElementChild;
			var last = (dragObject.elem === parent.lastElementChild) ? parent.children[parent.children.length - 2] : parent.lastElementChild;

			last.style.marginBottom = '';

			if(nextItem) {

				if(dragObject.lastNextItem) {
					if(dragObject.lastNextItem === first) parent.style.paddingTop = '';
					else dragObject.lastNextItem.style.marginTop = '';
				}

				dragObject.lastNextItem = nextItem;

				if(nextItem === first) parent.style.paddingTop = height + 'px';
				else {
					if(nextItem.offsetTop === 0) height += 8; // Это потому что марджины склеиваются
					nextItem.style.marginTop = height + 'px';
				}
			} else if(dragObject.elem.offsetTop > last.offsetTop) {
				if(dragObject.lastNextItem === last) last.style.marginTop = '';
				last.style.marginBottom = height + 8 + 'px';
			}
		}

		function mouseUp(event) {
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);

			if(!dragObject.start) return;

			var parent = dragObject.elem.parentElement;
			var lastElem = dragObject.lastNextItem;
			var first = (dragObject.elem === parent.firstElementChild) ? parent.children[1] : parent.firstElementChild;
			var last = (dragObject.elem === parent.lastElementChild) ? parent.children[parent.children.length - 2] : parent.lastElementChild;
			var oldPosition = getNumberItem();

			if(!lastElem || dragObject.elem.offsetTop > last.offsetTop) {
				parent.appendChild(dragObject.elem);
				if(lastElem === last) last.style.marginTop = '';
				last.style.marginBottom = '';
			}
			else {
				parent.insertBefore(dragObject.elem, lastElem);
				if(lastElem === first) parent.style.paddingTop = '';
				else lastElem.style.marginTop = '';
			}

			dragObject.elem.style.width = '';
			dragObject.elem.style.backgroundColor = '';
			dragObject.elem.style.left = '';
			dragObject.elem.style.top = '';
			dragObject.elem.style.position = '';
			dragObject.elem.style.zIndex = '';

			dragObject.start = false;

			var newPosition = getNumberItem();
			if(oldPosition === newPosition) return;

			var menu = document.querySelector('h1.heading').textContent;
			var category = dragObject.elem.parentElement.parentElement.querySelector('.carte__caption').textContent;
			var dishName = dragObject.elem.querySelector('.carte__dish-name').textContent;

			var params = 'food_menu=' + encodeURIComponent(menu) +
				'&category=' + encodeURIComponent(category) +
				'&dish_name=' + encodeURIComponent(dishName) +
				'&old_position=' + encodeURIComponent(oldPosition) +
				'&new_position=' + encodeURIComponent(newPosition);

			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'js/ajax/change_dish_order.php?' + params, true);
			xhr.send();

			xhr.onreadystatechange = function () {
				if(xhr.readyState !== 4) return;

				if(xhr.responseText !== 'OK') {
					alert('При изменении порядка блюд, возникла ошибка. Попробуйте повторить попытку позже.', 'bad', 7000);
					return;
				}
			}
		}

		function findNextElem() {
			var offsetTop = dragObject.elem.offsetTop;
			var offsetHeight = dragObject.elem.offsetHeight;
			var parent = dragObject.elem.parentElement;

			for(var i = 0, len = parent.children.length; i < len; i++) {
				if(parent.children[i] === dragObject.elem) continue;

				var offsetItem = parent.children[i].offsetTop;
				if(offsetItem - offsetTop > 0 && offsetItem - offsetTop < offsetHeight)  return parent.children[i];
			}

			return null;
		}

		function getNumberItem() {
			var list = dragObject.elem.parentElement;
			var item = dragObject.elem;

			for(var i = 0; i < list.children.length; i++) {
				if(list.children[i] === item) return i;
			}

			return 0;
		}
	});
}

AdminCarte.prototype.onClick = function(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;

	if(!target.classList.contains('admin-carte__add')
		&& !target.classList.contains('admin-carte__remove')) {

		return;
	}

	if(target.classList.contains('admin-carte__add')) this.addItem(target);
	else if(target.classList.contains('admin-carte__remove')) this.removeItem(target.parentElement);
};

AdminCarte.prototype.onDoubleClick = function(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;

	if(!target.classList.contains('carte__dish-name')
		&& !target.classList.contains('carte__ingridients')) {

		return;
	}

	if(target.classList.contains('carte__dish-name')) this.changeDishName(target);
	else if(target.classList.contains('carte__ingridients')) this.changeIngridients(target);

	event.preventDefault();
};

AdminCarte.prototype.addItem = function(item) {
	var menu = document.querySelector('h1.heading').textContent;
	var carte = item.parentElement.parentElement;
	var category = carte.querySelector('.carte__caption').textContent;

	var params = 'food_menu=' + encodeURIComponent(menu) + '&category=' + encodeURIComponent(category);

	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'js/ajax/add_dish.php?' + params, true);
	xhr.send();

	xhr.onreadystatechange = function() {
		if(xhr.readyState !== 4) return;

		var message = '';
		if(xhr.responseText === 'ERROR') {
			message = 'При добавлении нового блюда возникла ошибка.';
			return alert(message);
		}

		var li = document.createElement('li');
		li.className = 'carte__list-item admin-carte__list-item';

		var name = document.createElement('span');
		name.className = 'carte__dish-name';
		name.textContent = 'Name';

		var ingridients = document.createElement('span');
		ingridients.className = 'carte__ingridients';
		ingridients.textContent = 'Ingridients';

		var remove = document.createElement('div');
		remove.className = 'admin-carte__remove admin-action admin-action_remove';
		remove.textContent = '-';

		li.appendChild(name);
		li.appendChild(ingridients);
		li.appendChild(remove);

		carte.querySelector('.carte__list').appendChild(li);
	}
};

AdminCarte.prototype.removeItem = function(item) {
	var dishName = item.querySelector('.carte__dish-name').textContent;
	var message = 'Bы уверены, что хотите удалить блюдо с названием "' + dishName + '"?';

	confirm(
		message,
		remove,
		function() { return false; }
	);

	function remove() {
		var menu = document.querySelector('h1.heading').textContent;
		var category = item.parentElement.parentElement.querySelector('.carte__caption').textContent;

		var params = 'food_menu=' + encodeURIComponent(menu) +
			'&category=' + encodeURIComponent(category) +
			'&dish_name=' + encodeURIComponent(dishName);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/remove_dish_from_carte.php?' + params, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if(xhr.readyState !== 4) return;

			var message = '';
			if(xhr.responseText === 'OK') {
				message = 'Блюдо "' + dishName + '" было удалено из "' + category + '"';
				alert(message, 'well');
				item.parentElement.removeChild(item);
			} else {
				message = 'При удалении блюда "' + dishName + '" из "' + category + '" возникла ошибка. Попробуйте повторить попытку позже';
				alert(message, 'bad', 7000);
			}
		};
	}
};

AdminCarte.prototype.changeDishName = function(elem) {
	var dishName = elem.textContent;

	prompt(
		'Bведите новое название блюда',
		change,
		function() { return false; }
	);

	function change(newName) {
		if(newName.length > 200) {
			return alert('Максимальная длина названия блюда: 200 символов', 'bad', 7000);
		} else if(newName.length < 3) {
			return alert('Минимальная длина названия блюда: 3 символа', 'bad', 7000);
		} else if(newName === 'NULL') {
			return alert('Не надо так', 'bad');
		}

		var menu = document.querySelector('h1.heading').textContent;
		var category = elem.parentElement.parentElement.parentElement.querySelector('.carte__caption').textContent;

		var params = 'food_menu=' + encodeURIComponent(menu) +
			'&category=' + encodeURIComponent(category) +
			'&dish_name=' + encodeURIComponent(dishName) +
			'&new_name=' + encodeURIComponent(newName);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/change_dish_name.php?' + params, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if(xhr.readyState !== 4) return;

			var message = '';
			if(xhr.responseText === 'OK') {
				message = 'Новое название блюда: "' + newName + '"';
				alert(message, 'well');
				elem.textContent = newName;
			} else {
				message = 'При изменении названия блюда, возникла ошибка. Попробуйте повторить позже.';
				alert(message, 'bad', 6000);
			}
		};
	}
};

AdminCarte.prototype.changeIngridients = function(elem) {
	var ingridients = elem.textContent;

	prompt(
		'Bведите ингридиенты блюда. Если Вы хотите, чтобы их не было, оставьте поле пустым и нажмите "Ок"',
		change,
		function() { return false; }
	);

	function change(newIngridients) {
		if(newIngridients.length > 500) {
			return alert('Максимальная длина ингридиентов: 500 символов', 'bad', 7000);
		} else if(newIngridients === 'NULL') {
			return alert('Не надо так', 'bad');
		}

		var menu = document.querySelector('h1.heading').textContent;
		var category = elem.parentElement.parentElement.parentElement.querySelector('.carte__caption').textContent;
		var dishName = elem.parentElement.querySelector('.carte__dish-name').textContent;

		var params = 'food_menu=' + encodeURIComponent(menu) +
			'&category=' + encodeURIComponent(category) +
			'&dish_name=' + encodeURIComponent(dishName) +
			'&new_ingridients=' + encodeURIComponent(newIngridients);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/change_ingridients.php?' + params, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if(xhr.readyState !== 4) return;

			var message = '';

			if(xhr.responseText === 'OK') {
				if(newIngridients.length === 0) message = 'Теперь у блюда с названием "' + dishName + '" не перечислены ингридиенты.';
				message = 'Новые ингридиенты для "' + dishName + '": "' + newIngridients + '"';

				alert(message, 'well');
				elem.textContent = newIngridients;
			} else {
				message = 'При попытке изменить ингридиенты у блюда "' + dishName + '", возникла ошибка. Попробуйте повтороить позже ';
				alert(message, 'bad', 6000);
			}
		};
	}
};

function AdminPriceList(elem) {
	'use strict';
	var self = this;
	var priceTables = [];
	elem.querySelectorAll('.admin-price-table').forEach(function(item) {
		priceTables.push(new AdminPriceTable(item));
	});

	this.priceList = elem;
	this.priceTables = priceTables;
	this.captions = this.getCaptions();
	this.removeButton = elem.querySelector('.admin-price-list__remove');
	this.addButton = elem.querySelector('.admin-price-list__add');

	if (this.addButton) {
		this.addButton.addEventListener('click', function(event) {
			prompt(
				'Введите название категории.',
				function(text) {self.addCategory(text)},
				function () { return false; }
			)
		});
	}

	if (this.removeButton) {
		this.removeButton.addEventListener('click', function(event) {
			for (var i = 0; i < priceTables.length; i++) {
				var table = priceTables[i].table;

				if (priceTables[i].caption) table.parentElement.classList.add('admin-price-category_removable');
				else table.classList.add('admin-price-table_removable');
			}

			setTimeout(function() {document.addEventListener('click', documentClickListener);}, 0);

			function documentClickListener(event) {
				event = event || window.event;
				var target = event.target || event.srcElement;

				var category = getCategoryRemovableElement(target);
				for (var i = 0; i < priceTables.length; i++) {
					var table = priceTables[i].table;

					if (priceTables[i].caption) table.parentElement.classList.remove('admin-price-category_removable');
					else table.classList.remove('admin-price-table_removable');
				}

				document.removeEventListener('click', documentClickListener);
				if (category === null) return false;

				confirm(
					'Вы уверены, что хотите удалить категорию "' + category + '"?',
					function() { self.removeCategory(category) },
					function() { return false; }
				);
			}

			function getCategoryRemovableElement(elem) {
				var category = '';
				var removableElem = elem;

				link: while (removableElem !== document.body) {
					if (removableElem.classList.contains('admin-price-category_removable')) {
						category = removableElem.querySelector('.admin-price-table__category').textContent;
						break;
					}

					if (removableElem.classList.contains('admin-price-table_removable')) {
						var row = elem;
						while (row !== removableElem) {
							if (row.classList.contains('admin-price-table__row')) {
								category = row.cells[0].textContent;
								break link;
							}

							row = row.parentElement;
						}

						if (!category) break;
					}

					removableElem = removableElem.parentElement;
				}

				if (!category) return null;
				return category;
			}
		});
	}
}

AdminPriceList.prototype.getCaptions = function() {
	'use strict';

	var tables = this.priceTables;
	var captions = [];

	for(var i = 0; i < tables.length; i++) {
		if (tables[i].caption) captions.push(tables[i].caption.querySelector('.admin-price-table__category').textContent);
		else {
			var table = tables[i].table;
			for(var j = 0; j < table.rows.length; j++) {
				captions.push(table.rows[j].cells[0].textContent);
			}
		}
	}

	return captions;
};

AdminPriceList.prototype.addCategory = function(caption) {
	'use strict';
	var table = null;

	if (this.isTableWithCaption(caption) && this.isCategory(caption)) {
		// Уже где-то есть .admin-price-table с таким именем. Не надо делать новую
		alert('Категория с таким именем уже существует');
		return false;
	}

	if (this.isTableWithCaption(caption)) {
		// Такая категория уже есть, но в ней всего одна строка. Нужно сгенерировать таблицу
		table = this.generatePriceTableFromRow(caption);
		if (!table) return false;

		this.priceList.appendChild(table);
		var adminPriceTable = new AdminPriceTable(table.querySelector('.admin-price-table'));
		this.priceTables.push(adminPriceTable);
		this.captions = this.getCaptions();
		adminPriceTable.addItem();

		return true;
	} else {
		table = this.priceTables[0];
		table.addItem(caption);
	}

	return false;
};

AdminPriceList.prototype.removeCategory = function (caption) {
	'use strict';
	var that = this;

	if (!this.isTableWithCaption(caption)) {
		alert('Категория с таким именем не найдена');
		return false;
	}

	if (this.isCategory(caption)) {
		// Это целая таблица, в ней несколько строк
		ajaxRemoveCategory();

	} else {
		var row = this.getRowWithCaption(caption);
		this.priceTables[0].removeItem(row);
		this.captions = this.getCaptions();
		return true;
	}

	function remove() {
		var category = getCategory();
		if (category === null) return false;
		var table = that.priceTables[category].table;
		var section = table.parentElement;

		while (section.children[0]) {
			section.removeChild(section.children[0]);
		}
		that.priceTables.splice(category, 1);
		that.captions = that.getCaptions();
		return true;
	}

	function getCategory () {
		var tables = that.priceTables;

		for (var i = 0; i < tables.length; i++) {
			if (!tables[i].category) continue;
			if (tables[i].category === caption) return i;
		}

		return null;
	}

	function ajaxRemoveCategory() {
		var category = caption;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/remove_price_category.php?category=' + encodeURIComponent(category), true);
		xhr.send();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return false;
			if (xhr.responseText === 'OK') remove();
		};
	}
};

AdminPriceList.prototype.isTableWithCaption = function (caption) {
	'use strict';

	var captions = this.captions;

	for (var i = 0; i < captions.length; i++) {
		if (captions[i] === caption) return true;
	}

	return false;
};

AdminPriceList.prototype.isCategory = function (caption) {
	'use strict';

	var priceTables = this.priceTables;
	for (var i = 0; i < priceTables.length; i++) {
		if (!priceTables[i].caption) continue;

		if (caption === priceTables[i].caption.querySelector('.admin-price-table__category').textContent) return true;
	}

	return false;
};

AdminPriceList.prototype.getRowWithCaption = function (caption) {
	var categoriesTable = this.priceTables[0].table;
	for (var i = 0; i < categoriesTable.rows.length; i++) {
		var row = categoriesTable.rows[i];
		if (row.cells[0].textContent === caption) return row;
	}

	return null;
};

AdminPriceList.prototype.generatePriceTableFromRow = function (caption) {
	'use strict';
	var row = this.getRowWithCaption(caption);

	if (!row) return null;
	var section = document.createElement('section');

	var h2 = document.createElement('h2');
	h2.className = 'price-table__caption admin-price-table__caption';
	h2.innerHTML = '<span>' +
		'<span class="admin-price-table__category">' + caption + '</span>' +
		'<div class="admin-price-table__add admin-action admin-action_add">+</div>' +
		'<div class="admin-price-table__remove admin-action admin-action_remove">-</div>' +
		'</span>';

	var table = document.createElement('table');
	table.className = 'price-table admin-price-table';

	var tbody = document.createElement('tbody');

	var tr = document.createElement('tr');
	tr.className = 'price-table__row admin-price-table__row';

	var tdName = document.createElement('td');
	tdName.className = 'price-table__cell admin-price-table__cell';
	tdName.setAttribute('colspan', 2);
	tdName.textContent = row.cells[1].textContent;
	tr.appendChild(tdName);

	for (var i = 2; i < row.cells.length; i++) {
		tdName.setAttribute('colspan', (i - 1).toString());
		var tdValue = document.createElement('td');
		tdValue.className = 'price-table__cell admin-price-table__cell price-table__value';
		tdValue.textContent = row.cells[i].textContent;
		tr.appendChild(tdValue);
	}

	tbody.appendChild(tr);
	table.appendChild(tbody);
	section.appendChild(h2);
	section.appendChild(table);

	row.parentElement.removeChild(row);

	return section;
};

function AdminPriceTable(elem) {
	'use strict';
	var self = this;

	this.table = elem;
	this.table.addEventListener('dblclick', function (event) {
		event = event || window.event;
		var target = event.target || event.srcElement;

		if (!target.classList.contains('admin-price-table__cell')) return;

		var input = document.createElement('input');
		input.className = 'admin-price-table__change';
		input.value = target.textContent;

		target.appendChild(input);
		input.focus();

		input.onblur = function () {
			self.changeValue(target, input.value);

			input.onblur = null;
			document.body.appendChild(input);
			document.body.removeChild(input);
		};
	});

	this.caption = this.table.parentElement.querySelector('.admin-price-table__caption');
	if(!this.caption) return;

	this.category = this.caption.querySelector('.admin-price-table__category').textContent;
	this.caption.addEventListener('click', function (event) {
		event = event || window.event;
		var target = event.target || event.srcElement;

		if (!target.classList.contains('admin-price-table__add')
			&& !target.classList.contains('admin-price-table__remove')
		) return;

		if (target.classList.contains('admin-price-table__add')) self.addItem();

		if (target.classList.contains('admin-price-table__remove')) {
			self.table.classList.add('admin-price-table_removable');
			setTimeout(function () { document.addEventListener('click', documentClickListener); }, 0);
		}

		function documentClickListener(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;

			var row = self.getRow(target);
			if (row) self.removeItem(row);

			document.removeEventListener('click', documentClickListener);
			self.table.classList.remove('admin-price-table_removable');
		}
	});
}

AdminPriceTable.prototype.changeValue = function (cell, newValue) {
	'use strict';
	var self = this;
	var row = cell.parentElement;
	var isValue = cell.classList.contains('price-table__value');

	if (!isValue && !newValue) return false;
	if (!isValue) { // Значит это название услуги и они не должны повторяться
		if (isRowWithName(newValue)) {
			alert('"' + newValue + '" уже существует');
			return false;
		}
	}

	var category = this.category || row.cells[0].textContent;
	var name = (this.category) ? row.cells[0].textContent : row.cells[1].textContent;
	var oldValue = cell.textContent;
	var numberValue = getNumberValue();

	ajaxChangeValue();

	function change() {
		if (newValue) cell.textContent = newValue;
		else {
			var cellName = cell.parentElement.cells[0];
			var colspan = +cellName.getAttribute('colspan');
			cell.parentElement.removeChild(cell);
			var columns = self.getColumnsCount();
			self.changeColumnsCount(columns);
		}
	}

	function isRowWithName(name) {
		var rows = self.table.rows;
		var countRows = rows.length;

		for(var i = 0; i < countRows; i++) {
			if(rows[i] === cell.parentElement) continue;
			if(rows[i].cells[0] === newValue) return true;
		}

		return false;
	}

	function getNumberValue() {
		var cellNumber;
		for (var i = 0; i < row.cells.length; i++) {
			if (row.cells[i] === cell) cellNumber = i;
		}

		return (self.category) ? cellNumber + 1 : cellNumber;
	}

	function ajaxChangeValue() {
		var params = 'category=' + encodeURIComponent(category) +
			'&name=' + encodeURIComponent(name) +
			'&number_value=' + encodeURIComponent(numberValue) +
			'&old_value=' + encodeURIComponent(oldValue) +
			'&new_value=' + encodeURIComponent(newValue);
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/change_price_value.php?' + params, true);
		xhr.send();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return false;
			if (xhr.responseText === 'OK') change();
		}
	}
};

AdminPriceTable.prototype.addItem = function (caption) {
	'use strict';
	caption = caption || 'Имя';
	var that = this;

	ajaxAddItem();

	function add() {
		var tr = document.createElement('tr');
		tr.className = 'price-table__row admin-price-table__row';

		var value1 = document.createElement('td');
		value1.className = 'price-table__cell admin-price-table__cell';
		value1.setAttribute('colspan', 1);
		value1.textContent = caption;
		tr.appendChild(value1);

		var iterations = (that.caption) ? 2 : 3;
		for(var i = 0; i < iterations; i++) {
			var value = document.createElement('td');
			value.className = 'price-table__cell price-table__value admin-price-table__cell';
			value.textContent = 'Значение-' + (i + 1).toString();
			tr.appendChild(value);
		}

		that.changeColumnsCount(iterations + 1);
		that.table.tBodies[0].appendChild(tr);
	}

	function ajaxAddItem() {
		var category = that.category || caption;
		var name = (that.category) ? 'Имя' : 'Значение-1';
		var params = 'category=' + encodeURIComponent(category) + '&name=' + encodeURIComponent(name);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/add_price_row.php?' + params, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4) return false;
			if (xhr.responseText === 'OK') add();
		}
	}
};

AdminPriceTable.prototype.removeItem = function (item) {
	'use strict';
	var that = this;
	ajaxRemoveItem();

	function remove() {
		item.parentElement.removeChild(item);

		var columns = that.getColumnsCount();
		that.changeColumnsCount(columns);
	}

	function ajaxRemoveItem() {
		var category = that.category || item.cells[0].textContent;
		var name = (that.category) ? item.cells[0].textContent : item.cells[1].textContent;
		var params = 'category=' + encodeURIComponent(category) + '&name=' + encodeURIComponent(name);

		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/remove_price_row.php?' + params, true);
		xhr.send();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return false;
			if (xhr.responseText === 'OK') remove();
		}
	}
};

AdminPriceTable.prototype.changeColumnsCount = function (count) {
	'use strict';
	var that = this;
	var countRows = this.table.rows.length;
	clearColspans();

	for(var i = 0; i < countRows; i++) {
		var row = this.table.rows[i];
		var countCells = row.cells.length;

		if(countCells < count) {
			var colspan = count - countCells + 1;
			row.cells[0].setAttribute('colspan', colspan.toString());
		}
	}

	function clearColspans() {
		for (var i = 0; i < countRows; i++) {
			var row = that.table.rows[i];
			row.cells[0].setAttribute('colspan', 1);
		}
	}
};

AdminPriceTable.prototype.getColumnsCount = function () {
	'use strict';
	var countRows = this.table.rows.length;
	if(countRows) var maxColumns = this.table.rows[0].cells.length;

	for(var i = 1; i < countRows; i++) {
		var columns = this.table.rows[i].cells.length;
		if (columns > countRows) maxColumns = columns;
	}

	return maxColumns;
};

AdminPriceTable.prototype.getRow = function (elem) {
	'use strict';

	while (elem !== document.body) {
		if(elem.classList.contains('admin-price-table__row')) return elem;
		elem = elem.parentElement;
	}

	return null;
};

var cartes = document.querySelectorAll('.admin-carte');
if (cartes) cartes.forEach(function(item) {
	new AdminCarte(item);
});

var priceList = document.querySelector('.admin-price-list');
if (priceList) new AdminPriceList(priceList);

var animations = document.querySelector('.animations');
if (animations) new AdminAnimations(animations);

var coffeePrices = document.querySelectorAll('.coffee-card__price');
if (coffeePrices) {
	for (var i = 0; i < coffeePrices.length; i++) coffeePrices[i].onclick = onClickAtCoffeePrice;
}

function onClickAtCoffeePrice(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;
	var coffeeName = target.parentElement.querySelector('.coffee-card__caption').textContent;

	prompt(
		'Введите новою цену для "' + coffeeName + '"',
		function(text) { setCoffeePrice(text); },
		function() { return false; }
	);

	function setCoffeePrice(price) {
		var params = 'coffee_name=' + encodeURIComponent(coffeeName) +
			'&price=' + encodeURIComponent(price);
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'js/ajax/change_coffee_price.php?' + params, true);
		xhr.send();

		xhr.onreadystatechange = function() {
			if (xhr.readyState !== 4) return false;
			if (xhr.responseText === 'OK') target.textContent = price;
		}
	}
}

function confirm(message, ok, cancel) {
	var elem = document.querySelector('.admin-confirm');
	var messageEl = elem.querySelector('.admin-confirm__message');
	var buttonOk = elem.querySelector('.admin-confirm__button_ok');
	var buttonCancel = elem.querySelector('.admin-confirm__button_cancel');

	setMessage(message);
	show();

	elem.parentElement.onclick = onClick;

	function setMessage() {
		messageEl.textContent = message;
	}

	function show() {
		elem.parentElement.classList.add('admin-confirm_visible');
		elem.parentElement.classList.remove('admin-confirm_hidden');
	}

	function close() {
		elem.parentElement.classList.add('admin-confirm_hidden');
		elem.parentElement.classList.remove('admin-confirm_visible');
	}

	function onClick(event) {
		event = event || window.event;
		var target = event.target || event.srcElement;

		if(target === elem.parentElement || target === buttonCancel) {
			close();
			cancel();
		} else if(target === buttonOk) {
			close();
			ok();
		}
	}
}

function prompt(message, ok, cancel) {
	var elem = document.querySelector('.admin-prompt');
	var messageEl = elem.querySelector('.admin-prompt__message');
	var answerEl = elem.querySelector('.admin-prompt__input');
	var buttonOk = elem.querySelector('.admin-prompt__button_ok');
	var buttonCancel = elem.querySelector('.admin-prompt__button_cancel');

	setMessage(message);
	answerEl.value = '';
	show();

	elem.parentElement.onclick = onClick;

	function setMessage() {
		messageEl.textContent = message;
	}

	function show() {
		elem.parentElement.classList.add('admin-prompt_visible');
		elem.parentElement.classList.remove('admin-prompt_hidden');
	}

	function close() {
		elem.parentElement.classList.add('admin-prompt_hidden');
		elem.parentElement.classList.remove('admin-prompt_visible');
	}

	function onClick(event) {
		event = event || window.event;
		var target = event.target || event.srcElement;

		if(target === elem.parentElement || target === buttonCancel) {
			close();
			cancel();
		} else if(target === buttonOk) {
			close();
			ok(answerEl.value);
		}
	}
}

function alert(message, status, time) {
	time = time || 5000;

	var elem = document.querySelector('.admin-alert');
	elem.textContent = message;

	elem.classList.remove('admin-alert_bad');
	elem.classList.remove('admin-alert_well');

	if(status === 'bad') elem.classList.add('admin-alert_bad');
	if(status === 'well') elem.classList.add('admin-alert_well');

	elem.classList.remove('admin-alert_hidden');
	elem.classList.add('admin-alert_visible');

	setTimeout(function() {
		elem.classList.add('admin-alert_hidden');
		elem.classList.remove('admin-alert_visible');
	}, time);
}