'use strict';

function Slider(slider) {
	'use strict';

	this.slider = slider;
	this.imagesElement = slider.querySelector('.slider__images');
	this.roundsElement = slider.querySelector('.slider__rounds');
	this.count = this.imagesElement.querySelectorAll('img.slider__image').length;
	this.current = this.getCurrentImage();

	this.imagesElement.style.marginLeft = -(this.current * 100) + '%';
	this.imagesElement.style.width = this.count * 100 + '%';
	this.slider.onclick = this.onClick.bind(this);

	this.slider.addEventListener('mousedown', this.mouseDownListener.bind(this));
	this.slider.addEventListener('touchstart', this.mouseDownListener.bind(this));
}

Slider.prototype.mouseDownListener = function(event) {
	'use strict';
	event = event || window.event;
	var sliderWidth = this.slider.offsetWidth; // Ширина контейнера
	var downX = event.pageX || event.touches[0].pageX; // Точка, в которой пользователь начал двигать палец
	var that = this;

	event.preventDefault();
	event.stopPropagation();

	document.addEventListener('mousemove', mouseMoveListener);
	document.addEventListener('touchmove', mouseMoveListener);
	document.addEventListener('mouseup', mouseUpListener);
	document.addEventListener('touchend', mouseUpListener);

	function mouseMoveListener(event) {
		event = event || window.event;
		var currentMargin = that.current * sliderWidth; // Текущий отступ в пикселях
		var posX = event.pageX || event.touches[0].pageX; // Точка, в которой пользователь держит палец сейчас
		var margin = currentMargin + (downX - posX);

		margin = Math.min(margin, sliderWidth * (that.count - 1));
		margin = Math.max(margin, 0);

		that.imagesElement.style.marginLeft = -margin + 'px';
		event.preventDefault();
		event.stopPropagation();
		return true;
	}

	function mouseUpListener(event) {
		event = event || window.event;
		var posX = event.pageX || event.changedTouches[0].pageX;
		var width = Math.abs(downX - posX);

		document.removeEventListener('mousemove', mouseMoveListener);
		document.removeEventListener('touchmove', mouseMoveListener);
		document.removeEventListener('mouseup', mouseUpListener);
		document.removeEventListener('touchend', mouseUpListener);

		if (width > (sliderWidth / 3)) {
			if (downX < posX) return that.previous();
			else return that.next();
		}

		that.imagesElement.style.marginLeft = -(that.current * 100) + '%';
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
};

Slider.prototype.next = function() {
	'use strict';

	if (this.current >= this.count - 1) return false;

	var rounds = this.roundsElement;
	rounds.children[this.current].classList.remove('slider__round_active');
	this.imagesElement.style.transition = '0.6s margin-left ease';
	this.imagesElement.style.marginLeft = -(++this.current * 100) + '%';
	this.imagesElement.style.transition = '';
	rounds.children[this.current].classList.add('slider__round_active');
	return true;
};

Slider.prototype.previous = function() {
	'use strict';

	if (this.current === 0) return false;

	var rounds = this.roundsElement;
	rounds.children[this.current].classList.remove('slider__round_active');
	this.imagesElement.style.transition = '0.6s margin-left ease';
	this.imagesElement.style.marginLeft = -(--this.current * 100) + '%';
	this.imagesElement.style.transition = '';
	rounds.children[this.current].classList.add('slider__round_active');
	return true;
};

Slider.prototype.getCurrentImage = function() {
	'use strict';

	var rounds = this.roundsElement.querySelectorAll('.slider__round');
	for (var i = 0; i < rounds.length; i++) {
		if (rounds[i].classList.contains('slider__round_active')) return i;
	}

	return false;
};

Slider.prototype.onClick = function(event) {
	'use strict';
	event = event || window.event;
	var target = event.target || event.srcElement;

	if (target.classList.contains('slider__arrow_left')) return this.previous();
	if (target.classList.contains('slider__arrow_right')) return this.next();

	return false;
};

var submenuContainers = document.querySelectorAll('.main-menu__submenu-container_active');
if (submenuContainers) {
	for (var i = 0; i < submenuContainers.length; i++) {
		submenuContainers[i].classList.remove('main-menu__submenu-container_active');
		submenuContainers[i].onclick = function() {this.classList.toggle('main-menu__submenu-container_active');};
	}
}

var slider = document.querySelector('.slider');
if (slider) slider = new Slider(slider);

var photoSliderElement = document.querySelector('.photo-slider');
if (photoSliderElement) {
	var album = document.querySelector('.album-photos');
	var photos = album.querySelectorAll('.album-photos__photo');

	if (photos) {
		var sources = [];
		var albumName = album.dataset.albumName || album.getAttribute('data-album-name');

		var photoSlider = new PhotoSlider(photoSliderElement);
		photoSlider.setPhotos(sources);
		photoSlider.setAlbumName(albumName);

		for (var i = 0; i < photos.length; i++) {
			var photo = {};
			photo.href = photos[i].getAttribute('data-origin');
			if (photos[i].getAttribute('data-self')) photo.self = photos[i].getAttribute('data-self');
			sources.push(photo);
			photos[i].onclick = setAlbumPhotoClickListener(i);
		}
	}
}

var navigation = document.querySelector('.navigation');
if (navigation) navigation.onclick = function(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;

	if (!target.classList.contains('navigation')) return;
	target.classList.toggle('navigation_active');
	return true;
};

var foodMenu = document.querySelector('.food-menu');
if(foodMenu) {
	if(foodMenu.addEventListener) foodMenu.addEventListener('focus', onFocusFoodMenu, true);
	else foodMenu.onfocusin = onFocusFoodMenu;

	foodMenu.children[0].focus();
}

function setAlbumPhotoClickListener(numberPhoto) {
	return function() { photoSlider.show(numberPhoto); }
}

function onFocusFoodMenu(event) {
	event = event || window.event;
	var target = event.target || event.srcElement;

	if(!target.classList.contains('food-menu__item')) return;

	if(!target.classList.contains('food-menu__item_active')) {
		var activeItem = document.querySelector('.food-menu__item_active');
		if(activeItem) {
			activeItem.classList.remove('food-menu__item_active');
		}

		target.classList.add('food-menu__item_active');
	}

	var height = parseInt(this.style.minHeight || 0);
	var carteHeight = target.getElementsByClassName('food-menu__carte')[0].offsetHeight;

	if(carteHeight > height) this.style.minHeight = carteHeight + 'px';
}