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