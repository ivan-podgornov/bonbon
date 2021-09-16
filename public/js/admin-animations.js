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