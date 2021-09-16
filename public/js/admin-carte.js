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