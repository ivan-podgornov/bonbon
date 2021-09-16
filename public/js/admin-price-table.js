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