(function ($) {

	var JQSelectList = {
		list: [],
		add: function (select) {
			this.list.push(select);
		},
		destroy: function (trigger) {

			var self = this,
				i = 0;

			for (var len = self.list.length; i < len; i++) {
				if (self.list[i].trigger.is(trigger)) {
					self.list[i].jQSelect.destroy();
					break;
				}
			}

			self.list.splice(i, 1);

		}
	};

	var wrapTemplate = '<div class="jq-select-wrapper"/>';
	var dropdownTemplate =
		'<div class="jq-select-popup">\
			<input type="text" class="jq-select-filter" placeholder="filter..."/>\
			<label type="text" class="jq-select-select-all" placeholder="filter...">\
				<input type="checkbox" class="jq-select-select-all-checkbox"/>\
				<span class="jq-select-select-all-name"></span>\
			</label>\
			<div class="jq-select-list"></div>\
			<div class="jq-select-buttons">\
				<button type="button" class="jq-select-buttons-ok"></button>\
				<button type="button" class="jq-select-buttons-close"></button>\
			</div>\
		 </div>';
	var groupTemplate =
		'<div class="jq-select-group">\
			<label class="jq-select-group-title">\
				<input type="checkbox" class="jq-select-group-checkbox"/>\
				<span class="jq-select-group-title-name"></span>\
			</label>\
			<div class="jq-select-group-children"></div>\
		 </div>';
	var itemTemplate =
		'<label class="jq-select-item">\
			<input type="checkbox" class="jq-select-item-checkbox"/>\
			<i class="jq-select-item-icon"></i>\
			<span class="jq-select-item-name"></span>\
		 </label>';

	function JQSelect(trigger, options) {

		var _self = this,
			wrapper, dropdown;

		this._value = !options.group && options.multi ? [] : {};
		this.isLoading = false;
		this.filterText = '';
		this.filterData = null;

		function isPlainArrayData(data) {

			data = data || options.data;

			if (!$.isArray(data)) {
				return false;
			}

			if (data.filter(function (item) {
					return $.isPlainObject(item);
				}).length == 0) {
				return true;
			}

			return false;

		}

		function setLoading(bool) {
			_self.isLoading = bool;
			bool ? wrapper.addClass('loading') : wrapper.removeClass('loading');
		}

		function formatCheckbox() {

			if (!options.multi) {
				return;
			}

			var flag = true;

			if (options.group) {

				wrapper.find('.jq-select-group').each(function () {

					var groupFlag = true;

					$(this).find('.jq-select-item-checkbox').each(function () {
						if (!$(this).prop('checked')) {
							groupFlag = false;
							return false;
						}
					});

					$(this).find('.jq-select-group-checkbox').prop('checked', groupFlag);

					flag = flag && groupFlag;

				});

			} else {
				wrapper.find('.jq-select-item-checkbox').each(function () {
					if (!$(this).prop('checked')) {
						flag = false;
						return false;
					}
				});
			}

			wrapper.find('.jq-select-select-all-name').html(flag ? options.deselectAllText : options.selectAllText);
			wrapper.find('.jq-select-select-all-checkbox').prop('checked', flag);

		}

		function resetPopupPosition(dropdown) {

			dropdown = dropdown || wrapper.find('.jq-select-popup');
			var offset = trigger.offset();

			var triggerHeight = trigger.height();

			var dropdownHeight = 0;
			var data = _self.filterData || options.data;
			if (options.group) {
				for (var groupName in data) {
					if (data[groupName].length > 0) {
						dropdownHeight += (data[groupName].length + 1) * 30;
					}
				}
			} else {
				if (data && data.length > 0) {
					dropdownHeight = data.length * 30;
				}
			}
			dropdownHeight = dropdownHeight > 300 ? 300 : dropdownHeight;

			if (options.multi && options.hideSelectAll === false) {
				dropdownHeight += 30;
			}
			if (options.hideFilter === false) {
				dropdownHeight += 30;
			}
			if (options.hideOKButton === false || options.hideCloseButton === false) {
				dropdownHeight += 40;
			}

			if (offset.top + triggerHeight + dropdownHeight - $(window).scrollTop() > $(window).height()) {
				dropdown.css('top', -dropdownHeight);
			} else {
				dropdown.css('top', triggerHeight);
			}

		}

		function getFilteredData() {

			var result;

			if (options.group) {
				result = {};
				for (var groupName in options.data) {
					var data = options.data[groupName].filter(function (item) {
						if ($.isPlainObject(item)) {
							return item && item[options.displayField]
								&& item[options.displayField].toUpperCase().indexOf(_self.filterText.toUpperCase()) > -1;
						} else {
							return item && item.toUpperCase().indexOf(_self.filterText.toUpperCase()) > -1;
						}
					});
					if (data.length > 0) {
						result[groupName] = data;
					}
				}
			} else {
				result = options.data.filter(function (item) {
					if ($.isPlainObject(item)) {
						return item && item[options.displayField]
							&& item[options.displayField].toUpperCase().indexOf(_self.filterText.toUpperCase()) > -1;
					} else {
						return item && item.toUpperCase().indexOf(_self.filterText.toUpperCase()) > -1;
					}
				});
			}

			return result;

		}

		function renderPopupList(data) {

			data = data || options.data;

			var list = dropdown.find('.jq-select-list').html('');

			if (options.group) { // group

				if (!$.isEmptyObject(data)) {
					for (var groupName in data) {

						var group = $(groupTemplate).attr('data-name', groupName);

						if (options.multi) {
							_self._value[groupName] && data[groupName]
							&& _self._value[groupName].length == data[groupName].length
							&& group.find('.jq-select-group-checkbox').prop('checked', true);
						} else {
							group.find('.jq-select-group-checkbox').remove();
						}

						group.find('.jq-select-group-title-name').html(groupName);

						var children = group.find('.jq-select-group-children');
						data[groupName].forEach(function (item) {

							if (isPlainArrayData(data[groupName])) {

								var itemEl = $(itemTemplate);

								if (options.multi) {

									if (
										_self._value[groupName]
										&&
										_self._value[groupName].filter(function (_valueItem) {
											return _valueItem && item && _valueItem.toString() === item.toString();
										}).length == 1
									) {
										itemEl.find('.jq-select-item-checkbox').prop('checked', true);
									}

								} else {

									itemEl.find('.jq-select-item-checkbox').remove();

									if (
										_self._value[groupName] && _self._value[groupName] && item
										&&
										_self._value[groupName].toString() === item.toString()
									) {
										itemEl.addClass('activated');
									}

								}

								itemEl.find('.jq-select-item-name').html(item);

							} else {

								var itemEl = $(itemTemplate);

								if (options.multi) {

									if (
										_self._value[groupName]
										&&
										_self._value[groupName].filter(function (_valueItem) {
											return _valueItem[options.valueField] && item[options.valueField]
												&& _valueItem[options.valueField].toString() === item[options.valueField].toString();
										}).length == 1
									) {
										itemEl.find('.jq-select-item-checkbox').prop('checked', true);
									}

								} else {

									itemEl.find('.jq-select-item-checkbox').remove();

									if (
										_self._value[groupName]
										&&
										_self._value[groupName][options.valueField] && item[options.valueField]
										&&
										_self._value[groupName][options.valueField].toString() === item[options.valueField].toString()
									) {
										itemEl.addClass('activated');
									}

								}

								if (item[options.iconClsField]) {
									itemEl.find('.jq-select-item-icon').addClass(item[options.iconClsField]);
								} else {
									itemEl.find('.jq-select-item-icon').remove();
								}

								itemEl.find('.jq-select-item-name').html(item[options.displayField]);

							}

							children.append(itemEl);

						});

						list.append(group);

					}
				}

			} else { // not group

				if ($.isArray(data)) {
					data.forEach(function (item) {

						var itemEl

						if (isPlainArrayData(data)) {

							itemEl = $(itemTemplate);

							if (options.multi) {
								_self._value.filter(function (_valueItem) {
									return _valueItem && item && _valueItem.toString() === item.toString();
								}).length == 1 && itemEl.find('.jq-select-item-checkbox').prop('checked', true);
							} else {
								itemEl.find('.jq-select-item-checkbox').remove();
								_self._value && item && _self._value.toString() === item.toString()
								&& itemEl.addClass('activated');
							}

							itemEl.find('.jq-select-item-name').html(item);

						} else {

							itemEl = $(itemTemplate);

							if (options.multi) {
								_self._value.filter(function (_valueItem) {
									return _valueItem[options.valueField] && item[options.valueField]
										&& _valueItem[options.valueField].toString() === item[options.valueField].toString();
								}).length == 1 && itemEl.find('.jq-select-item-checkbox').prop('checked', true);
							} else {
								itemEl.find('.jq-select-item-checkbox').remove();
								_self._value[options.valueField] && item[options.valueField]
								&& _self._value[options.valueField].toString() === item[options.valueField].toString()
								&& itemEl.addClass('activated');
							}

							itemEl.find('.jq-select-item-name').html(item[options.displayField]);

						}

						list.append(itemEl);

					});
				}

			}

		}

		function showPopup() {

			// dropdown
			dropdown = $(dropdownTemplate).css('min-width', options.triggerWidth);

			if (options.popupWidth === 'auto') {
				dropdown.css('width', 'auto');
			} else if (!isNaN(options.popupWidth)) {
				dropdown.width(options.popupWidth);
			}

			// filter
			if (options.hideFilter) {
				dropdown.find('.jq-select-filter').remove();
			} else {
				dropdown.find('.jq-select-filter').val(_self.filterText);
			}

			// Select All
			if (!options.multi || options.hideSelectAll) {
				dropdown.find('.jq-select-select-all').remove();
			} else {
				dropdown.find('.jq-select-select-all-name').html(options.selectAllText);
			}

			if (_self.filterText) {
				_self.filterData = getFilteredData();
				renderPopupList(_self.filterData);
			} else {
				renderPopupList();
			}

			// buttons
			var buttons = dropdown.find('.jq-select-buttons');
			var okButton = dropdown.find('.jq-select-buttons-ok');
			var cancelButton = dropdown.find('.jq-select-buttons-close');
			if (options.hideOKButton && options.hideCloseButton) {
				buttons.remove();
			} else {

				// ok button
				if (options.hideOKButton) {
					okButton.remove();
					buttons.addClass('hide-ok-button');
				} else {
					okButton.html(options.okButtonText);
				}

				// cancel button
				if (options.hideCloseButton) {
					cancelButton.remove();
					buttons.addClass('hide-cancel-button');
				} else {
					cancelButton.html(options.closeButtonText);
				}

			}

			resetPopupPosition(dropdown);

			// append to body
			wrapper.append(dropdown);

		};

		function removePopup() {
			wrapper.children('.jq-select-popup').remove();
		};

		function bindFilterEvents() {

			wrapper.find('.jq-select-filter').bind('input', function (e) {

				_self.filterText = e.target.value;

				if (!_self.filterText) {
					renderPopupList();
					resetPopupPosition();
					return;
				}

				_self.filterData = getFilteredData()
				renderPopupList(_self.filterData);
				resetPopupPosition();

			});

		};

		function bindSelectEvents() {

			// select all
			wrapper.find('.jq-select-select-all').change(function (e) {

				e.stopPropagation();

				if (!options.data) {
					return;
				}

				var selectedItems = [];
				var checkbox = $(this).children('input[type="checkbox"]');
				var checked = checkbox.prop('checked');

				wrapper.find('.jq-select-select-all-name').html(checked ? options.deselectAllText : options.selectAllText);
				wrapper.find('.jq-select-group-checkbox').prop('checked', checked);
				wrapper.find('.jq-select-item-checkbox').prop('checked', checked);

				if (options.group) {
					var data = $.extend(true, {}, options.data);
					for (var i in data) {
						selectedItems = selectedItems.concat(data[i]);
					}
				} else {
					selectedItems = $.extend(true, [], options.data);
				}

				if (checked) {
					onSelect(selectedItems);
				} else {
					onDeselect(selectedItems);
				}

			});

			// select group
			wrapper.find('.jq-select-group-title').change(function (e) {

				e.stopPropagation();

				if (!options.data) {
					return;
				}

				var checked = $(this).children('input[type="checkbox"]').prop('checked');
				var group = $(this).parents('.jq-select-group');
				var groupName = group.attr('data-name');

				if (!options.data[groupName]) {
					return;
				}

				group.find('.jq-select-item-checkbox').prop('checked', checked);
				var selectedItems = $.extend(true, [], options.data[groupName]);

				formatCheckbox();

				if (checked) {
					onSelect(selectedItems);
				} else {
					onDeselect(selectedItems);
				}

			});

			// select item
			if (options.multi) {
				wrapper.find('.jq-select-item').change(function (e) {

					e.stopPropagation();

					if (!options.data) {
						return;
					}

					var selectedItem;

					if (options.group) {

						var group = $(this).parents('.jq-select-group');
						var groupName = group.attr('data-name');

						if (!options.data[groupName]) {
							return;
						}

						selectedItem = options.data[groupName][group.find('.jq-select-item').index($(this))];

					} else {
						var list = $(this).parents('.jq-select-list');
						selectedItem = options.data[list.find('.jq-select-item').index($(this))];
					}

					var checked = $(this).children('input[type="checkbox"]').prop('checked');

					formatCheckbox();

					if (checked) {
						onSelect([selectedItem]);
					} else {
						onDeselect([selectedItem]);
					}

				});
			} else {
				wrapper.find('.jq-select-item').mousedown(function (e) {

					e.stopPropagation();

					if (!options.data) {
						return;
					}

					var selectedItem;

					if (options.group) {

						var group = $(this).parents('.jq-select-group');
						var groupName = group.attr('data-name');

						if (!options.data[groupName]) {
							return;
						}

						selectedItem = options.data[groupName][group.find('.jq-select-item').index($(this))];

					} else {
						var list = $(this).parents('.jq-select-list');
						selectedItem = options.data[list.find('.jq-select-item').index($(this))];
					}

					wrapper.find('.jq-select-item').removeClass('activated');
					$(this).addClass('activated');
					onSelect(selectedItem);

				});
			}

		};

		function bindButtonsEvents() {

			wrapper.find('.jq-select-buttons-ok').mousedown(function (e) {
				e.stopPropagation();
				triggerChange();
				removePopup();
				wrapper.removeClass('activated');
				options.onOK && options.onOK();
			});

			wrapper.find('.jq-select-buttons-close').mousedown(function (e) {
				e.stopPropagation();
				removePopup();
				wrapper.removeClass('activated');
				options.onClose && options.onClose();
			});

		};

		function onSelect(items) {

			options.onSelect && options.onSelect(items);

			if (options.hideOKButton) { // trigger onChange callback if ok button is hidden
				triggerChange();
			}

		};

		function onDeselect(items) {

			options.onDeselect && options.onDeselect(items);

			if (options.hideOKButton) { // trigger onChange callback if ok button is hidden
				triggerChange();
			}

		};

		function initValue() {

			if (!options.data || !options.value) {
				return;
			}

			if (options.multi && options.group) { // multi & group

				var result = {}, count = 0;

				for (var groupName in options.data) {

					if (!options.value[groupName]) {
						continue;
					}

					var group = [];

					options.data[groupName].forEach(function (dataItem) {
						options.value[groupName].forEach(function (valueItem) {

							var dataValue, valueValue;

							if ($.isPlainObject(dataItem)) {
								dataValue = dataItem[options.valueField].toString();
							} else {
								dataValue = dataItem.toString();
							}

							if ($.isPlainObject(valueItem)) {
								valueValue = valueItem[options.valueField].toString();
							} else {
								valueValue = valueItem.toString();
							}

							if (dataValue && valueValue && dataValue === valueValue) {
								group.push(dataItem);
								count++;
							}

						});
					});

					if (group.length > 0) {
						result[groupName] = group;
					}

				}

				if (count > 0) {
					trigger.children('.jq-select-text').html(count + ' selected');
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}
				_self._value = $.extend(true, {}, result);

			} else if (options.multi && !options.group) { // multi & not group

				var result = [], count = 0;

				options.data.forEach(function (dataItem) {
					options.value.forEach(function (valueItem) {

						var dataValue, valueValue;

						if ($.isPlainObject(dataItem)) {
							dataValue = dataItem[options.valueField].toString();
						} else {
							dataValue = dataItem.toString();
						}

						if ($.isPlainObject(valueItem)) {
							valueValue = valueItem[options.valueField].toString();
						} else {
							valueValue = valueItem.toString();
						}

						if (dataValue && valueValue && dataValue === valueValue) {
							result.push(dataItem);
							count++;
						}

					});
				});

				if (count > 0) {
					trigger.children('.jq-select-text').html(count + ' selected');
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}
				_self._value = $.extend(true, [], result);

			} else if (!options.multi && options.group) { // single & group

				var result = {}, display = '', breakFlag = false;

				for (var groupName in options.data) {

					if (breakFlag) {
						break;
					}

					if (!options.value[groupName]) {
						continue;
					}

					options.data[groupName].forEach(function (dataItem) {

						if (breakFlag) {
							return;
						}

						var valueItem = options.value[groupName],
							dataValue, dataDisplay, valueValue;

						if ($.isPlainObject(dataItem)) {
							dataValue = dataItem[options.valueField].toString();
							dataDisplay = dataItem[options.displayField].toString();
						} else {
							dataValue = dataItem.toString();
							dataDisplay = dataItem.toString();
						}

						if ($.isPlainObject(valueItem)) {
							valueValue = valueItem[options.valueField].toString();
						} else {
							valueValue = valueItem.toString();
						}

						if (dataValue && valueValue && dataValue === valueValue) {
							display = dataDisplay;
							result[groupName] = dataItem;
							breakFlag = true;
							return;
						}

					});

				}

				if (result) {
					trigger.children('.jq-select-text').html(display);
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}
				_self._value = $.extend(true, {}, result);

			} else { // single & not group

				var result, display = '', breakFlag = false;

				options.data.forEach(function (dataItem) {

					if (breakFlag) {
						return;
					}

					var valueItem = options.value,
						dataValue, dataDisplay, valueValue;

					if ($.isPlainObject(dataItem)) {
						dataValue = dataItem[options.valueField].toString();
						dataDisplay = dataItem[options.displayField].toString();
					} else {
						dataValue = dataItem.toString();
						dataDisplay = dataItem.toString();
					}

					if ($.isPlainObject(valueItem)) {
						valueValue = valueItem[options.valueField].toString();
					} else {
						valueValue = valueItem.toString();
					}

					if (dataValue && valueValue && dataValue === valueValue) {
						display = dataDisplay;
						result = dataItem;
						breakFlag = true;
						return;
					}

				});

				if (result) {
					trigger.children('.jq-select-text').html(display);
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}

				if ($.isPlainObject(result)) {
					_self._value = $.extend(true, {}, result);
				} else {
					_self._value = result;
				}

			}

		}

		function triggerChange() {

			if (!options.data) {
				return;
			}

			if (options.multi && options.group) { // multi & group

				var checkedCheckboxes = wrapper.find('.jq-select-item-checkbox:checked'),
					result = {},
					count = checkedCheckboxes.length

				checkedCheckboxes.each(function () {

					var group = $(this).parents('.jq-select-group');
					var groupName = group.attr('data-name');

					if (!options.data[groupName]) {
						return;
					}

					if (!result[groupName]) {
						result[groupName] = [];
					}

					result[groupName].push(options.data[groupName][group.find('.jq-select-item-checkbox').index($(this))]);

				});

				if (count > 0) {
					trigger.children('.jq-select-text').html(count + ' selected');
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}

				if (JSON.stringify(_self._value) != JSON.stringify(result)) {
					options.onChange && options.onChange(result);
					_self._value = $.extend(true, {}, result);
				}

			} else if (options.multi && !options.group) { // multi & not group

				var checkedCheckboxes = wrapper.find('.jq-select-item-checkbox:checked'),
					result = [],
					count = checkedCheckboxes.length;

				checkedCheckboxes.each(function () {
					var list = $(this).parents('.jq-select-list');
					result.push(options.data[list.find('.jq-select-item-checkbox').index($(this))]);
				});

				if (count > 0) {
					trigger.children('.jq-select-text').html(count + ' selected');
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}

				if (JSON.stringify(_self._value) != JSON.stringify(result)) {
					options.onChange && options.onChange(result);
					_self._value = $.extend(true, [], result);
				}

			} else if (!options.multi && options.group) { // single & group

				var selected = wrapper.find('.jq-select-item.activated'),
					result = {};

				var group = selected.parents('.jq-select-group');
				var groupName = group.attr('data-name');

				if (!options.data[groupName]) {
					return;
				}

				if (!result[groupName]) {
					result[groupName] = [];
				}

				var item = options.data[groupName][group.find('.jq-select-item').index(selected)];
				result[groupName] = item;

				trigger.children('.jq-select-text').html($.isPlainObject(item) ? item[options.displayField] : item);

				if (JSON.stringify(_self._value) != JSON.stringify(result)) {
					options.onChange && options.onChange(result);
					_self._value = $.extend(true, {}, result);
				}

			} else { // single & not group

				var selected = wrapper.find('.jq-select-item.activated');

				var list = selected.parents('.jq-select-list');
				var result = options.data[list.find('.jq-select-item').index(selected)];

				if ($.isPlainObject(result)) {

					trigger.children('.jq-select-text').html(result[options.displayField]);

					if (JSON.stringify(_self._value) !== JSON.stringify(result)) {
						options.onChange && options.onChange(result);
						_self._value = $.extend(true, {}, result);
					}

				} else {

					trigger.children('.jq-select-text').html(result);

					if (_self._value !== result) {
						options.onChange && options.onChange(result);
						_self._value = result;
					}

				}

			}

			if (options.autoClose) {

				removePopup();

				if (wrapper.hasClass('activated')) {
					wrapper.removeClass('activated');
					options.onClose && options.onClose();
				}

			}

		};

		function mousedownHandle(e) {

			if ($(e.target).is(trigger)
				|| $(e.target).parents('.jq-select').is(trigger)) {

				e.stopPropagation();
				removePopup();

				if (wrapper.hasClass('activated')) {
					wrapper.removeClass('activated');
					options.onClose && options.onClose();
					return;
				}

				if (!_self.isLoading) {

					wrapper.addClass('activated');

					showPopup();

					bindFilterEvents();

					bindSelectEvents();

					bindButtonsEvents();

				}

			} else if ($(e.target).parents('.jq-select-wrapper').length == 0
				|| !$(e.target).parents('.jq-select-wrapper').is(wrapper)) {

				e.stopPropagation();

				removePopup();

				if (wrapper.hasClass('activated')) {
					wrapper.removeClass('activated');
					options.onClose && options.onClose();
				}

			}

		}

		function resizeHandle() {
			resetPopupPosition();
		}

		this.init = function () {

			if (!trigger.hasClass('jq-select-formated')) {
				trigger.addClass('jq-select-formated')
					.html('<span class="jq-select-text">' + options.noSelectText + '</span>')
					.wrap(wrapTemplate);
			}
			trigger.css('width', options.triggerWidth);
			trigger.find('.jq-select-icon').remove();
			if (options.iconCls) {
				trigger.find('.jq-select-text').before('<i class="jq-select-icon ' + options.iconCls + '"></i>');
			}
			initValue();

			wrapper = trigger.parent()
				.toggleClass('jq-select-option-multi', options.multi)
				.toggleClass('jq-select-option-group', options.group);

			$(document).on('mousedown', mousedownHandle);
			$(window).on('resize', resizeHandle);

			trigger.off().on('updateOptions', function () {
				options = $.extend(true, {}, $.fn.JQSelect.defaults, options);
				return this;
			}).on('loadingStart', function () {
				setLoading(true);
				return this;
			}).on('loadingEnd', function () {
				setLoading(false);
				return this;
			});

		}

		this.destroy = function () {

			removePopup();
			wrapper.removeClass('activated');

			$(document).off('mousedown', mousedownHandle);
			$(window).off('resize', resizeHandle);

		};

		this.init();
		return {
			jQSelect: _self,
			trigger: trigger,
			wrapper: wrapper
		};

	}

	$.fn.JQSelect = function (options) {
		return this.each(function () {
			JQSelectList.destroy($(this));
			JQSelectList.add(new JQSelect($(this), $.extend(true, {}, $.fn.JQSelect.defaults, options)));
		});
	};

	$.fn.JQSelect.defaults = {

		multi: false,
		group: false,

		data: null,
		valueField: 'value',
		displayField: 'label',
		iconClsField: 'iconCls',
		value: null,

		iconCls: '',
		noSelectText: 'Please select ...',

		triggerWidth: 200,
		popupWidth: 200,

		hideFilter: false,

		hideSelectAll: false,
		selectAllText: 'Select All',
		deselectAllText: 'Deselect All',

		hideOKButton: false,
		okButtonText: 'OK',
		hideCloseButton: false,
		closeButtonText: 'Close',
		autoClose: false,

		onSelect: null,
		onDeselect: null,
		onChange: null,
		onOK: null,
		onClose: null

	};

}(jQuery));