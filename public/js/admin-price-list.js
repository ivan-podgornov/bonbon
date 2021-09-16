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