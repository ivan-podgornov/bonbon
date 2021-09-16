function PhotoSlider(slider) {
	'use strict';
	this.slider = slider;
	if (slider.getAttribute('data-token')) this._token = slider.getAttribute('data-token');
	this._photoContainer = slider.querySelector('.photo-slider__photo-container');
	this._photoElement = slider.querySelector('.photo-slider__photo');
	this._albumNameElement = slider.querySelector('.photo-slider__album-name');
	this._currentNumberElement = slider.querySelector('.photo-slider__current');
	this._countElement = slider.querySelector('.photo-slider__count');
	this._closeElement = slider.querySelector('.photo-slider__close');
	this._fadingCircleElement = slider.querySelector('.photo-slider__fading-circle');

	this._current = -1;
	this._count = 0;

	this._setPosition = this._setPosition.bind(this);
	this._onMouseOverInContainer = this.onMouseOverInContainer.bind(this);
	this._onMouseOutFromContainer = this.onMouseOutFromContainer.bind(this);
	this._onClick = this._onClick.bind(this);

	this._photoContainer.addEventListener('mouseover', this._onMouseOverInContainer);
	this._photoContainer.addEventListener('mouseout', this._onMouseOutFromContainer);
	this.slider.addEventListener('click', this._onClick);
}

PhotoSlider.prototype.show = function(numberPhoto) {
	if (!this.photos || !this.photos[numberPhoto]) return false;
	var that = this;

	document.body.style.overflow = 'hidden';
	this.slider.classList.remove('photo-slider_hidden');
	this._fadingCircleElement.classList.remove('photo-slider__fading-circle_hidden');

	this._photoElement.setAttribute('src', this.photos[numberPhoto].href);
	this._setCurrentNumber(numberPhoto);
	this._setCount();

	this._photoElement.onload = function() {
		that._fadingCircleElement.classList.add('photo-slider__fading-circle_hidden');
		that._setPosition();
	};

	window.addEventListener('resize', this._setPosition);
	return true;
};

PhotoSlider.prototype.close = function() {
	document.body.style.overflow = '';
	this.slider.classList.add('photo-slider_hidden');
	window.removeEventListener('resize', this._setPosition);

	return true;
};

PhotoSlider.prototype.showNext = function() {
	'use strict';

	var that = this;
	var number = (this._current < this._count - 1) ? this._current + 1 : 0;

	this._fadingCircleElement.classList.remove('photo-slider__fading-circle_hidden');
	this._photoElement.setAttribute('src', this.photos[number].href);
	this._setCurrentNumber(number);

	this._photoElement.onload = function() {
		that._fadingCircleElement.classList.add('photo-slider__fading-circle_hidden');
		that._setPosition();
	};
	return true;
};

PhotoSlider.prototype.showPrevious = function() {
	'use strict';

	var that = this;
	var number = (this._current > 0) ? this._current - 1 : this._count - 1;

	this._fadingCircleElement.classList.remove('photo-slider__fading-circle_hidden');
	this._photoElement.setAttribute('src', this.photos[number].href);
	this._setCurrentNumber(number);

	this._photoElement.onload = function() {
		that._fadingCircleElement.classList.add('photo-slider__fading-circle_hidden');
		that._setPosition();
	};
	return true;
};

PhotoSlider.prototype.setPhotos = function(photos) {
	'use strict';
	this.photos = photos;
	return true;
};

PhotoSlider.prototype.setAlbumName = function(name) {
	if (!name) return false;
	this._albumNameElement.textContent = name;
	return true;
};

PhotoSlider.prototype._setCurrentNumber = function(number) {
	'use strict';
	if (number < 0 || number > this.photos.length) return false;
	this._currentNumberElement.textContent = number + 1;
	this._current = number;
	return true;
};

PhotoSlider.prototype._setCount = function() {
	'use strict';
	if (!this.photos) return false;
	this._countElement.textContent = this.photos.length;
	this._count = this.photos.length;
	return true;
};

PhotoSlider.prototype._removePhoto = function() {
	'use strict';

	var that = this;
	var self = this.photos[this._current].self;

	ajaxRemovePhoto();

	function ajaxRemovePhoto() {
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', self, true);
		xhr.setRequestHeader('Authorization', that._token);
		xhr.send();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return false;
			if (xhr.status === 204) return remove();
			else return alert('При удалении фотографии возникла ошибка. Попробуйте позже', 'bad', 7000);
		}
	}

	function remove() {
		if (that._count === 1) return that.close();

		that.photos.splice(that._current, 1);
		that._setCount();

		if (that._current > that._count - 1) that._setCurrentNumber(0);

		this._photoElement.setAttribute('src', that.photos[that._current].href);
		this._setPosition();

		return true;
	}
};

PhotoSlider.prototype._setPosition = function() {
	'use strict';
	var windowHeight = this.slider.offsetHeight;
	var windowWidth = this.slider.offsetWidth;
	var containerHeight = this._photoContainer.offsetHeight;

	if (windowWidth < 980) {
		this._photoElement.style.maxHeight = '';
		this._photoContainer.style.top = '';
	}
	else {
		this._photoContainer.style.top = Math.max(((windowHeight - containerHeight) / 2) , 0) + 'px';
		this._photoElement.style.maxHeight = Math.max(((windowHeight / 100 * 95) - 48), 0)  + 'px';
	}

	return true;
};

PhotoSlider.prototype._onClick = function(event) {
	'use strict';
	event = event || window.event;
	var target = event.target || event.srcElement;
	var that = this;

	if (target === this._closeElement) return this.close();
	if (target.classList.contains('photo-slider__arrow_left')) return this.showPrevious();
	if (target.classList.contains('photo-slider__arrow_right')) return this.showNext();
	if (target.classList.contains('photo-slider__remove')) {
		return confirm(
			'Вы уверены, что хотите удалить это фото?',
			function() { that._removePhoto(); },
			function() { return false; }
		);
	}

	while (target !== document.body) {
		if (target === this._photoContainer) {
			event.stopPropagation();
			return false;
		}
		target = target.parentElement;
	}

	return this.close();
};

PhotoSlider.prototype.onMouseOverInContainer = function() {
	'use strict';
	this._closeElement.classList.add('photo-slider__close_passive');
};

PhotoSlider.prototype.onMouseOutFromContainer = function() {
	'use strict';
	this._closeElement.classList.remove('photo-slider__close_passive');
};