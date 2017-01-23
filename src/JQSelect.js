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
			<div class="jq-select-list">\
				<div class="jq-select-list-scroller"></div>\
			</div>\
			<div class="jq-select-buttons">\
				<button type="button" class="jq-select-buttons-ok"></button>\
				<button type="button" class="jq-select-buttons-clear"></button>\
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
		this._selectedValue = !options.group && options.multi ? [] : {};
		this._isLoading = false;
		this._filterText = '';
		this._filterData = null;
		this._listScrollTop = 0;

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
			_self._isLoading = bool;
			bool ? wrapper.addClass('loading') : wrapper.removeClass('loading');
		}

		function resetPopupPosition(dropdown) {

			dropdown = dropdown || wrapper.find('.jq-select-popup');
			var offset = trigger.offset();

			var triggerHeight = trigger.height();

			var dropdownHeight = 0;
			var data = _self._filterData || options.data;
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
			if (options.hideOKButton === false || options.hideCloseButton === false || options.hideClearButton === false) {
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
								&& item[options.displayField].toUpperCase().indexOf(_self._filterText.toUpperCase()) > -1;
						} else {
							return item && item.toUpperCase().indexOf(_self._filterText.toUpperCase()) > -1;
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
							&& item[options.displayField].toUpperCase().indexOf(_self._filterText.toUpperCase()) > -1;
					} else {
						return item && item.toUpperCase().indexOf(_self._filterText.toUpperCase()) > -1;
					}
				});
			}

			return result;

		}

		function renderPopupList(op) {

			var data = op && op.data || options.data,
				scrollTop = op && op.scrollTop || 0,
				list = wrapper.find('.jq-select-list-scroller').html(''),
				heightCount = 0;

			if (options.group) { // group

				if ($.isEmptyObject(data)) {
					return;
				}

				var isFirstGroup = true;

				for (var groupName in data) {

					// not render if the group el below the display area
					if (heightCount > scrollTop + options.listHeight) {
						break;
					}

					if (heightCount <= scrollTop + options.listHeight
						&& heightCount + options.groupTitleHeight + options.itemHeight * data[groupName].length >= scrollTop) {

						var group = $(groupTemplate).attr('data-name', groupName);

						if (isFirstGroup) {
							list.append('<div style="height:' + heightCount + 'px"></div>');
							isFirstGroup = false;
						}

						heightCount += options.groupTitleHeight;

						if (options.multi) {
							_self._selectedValue[groupName] && data[groupName]
							&& _self._selectedValue[groupName].length == data[groupName].length
							&& group.find('.jq-select-group-checkbox').prop('checked', true);
						} else {
							group.find('.jq-select-group-checkbox').remove();
						}

						group.find('.jq-select-group-title-name').html(groupName);

						var children = group.find('.jq-select-group-children');
						var isFirstItem = true;

						for (var i = 0, len = data[groupName].length; i < len; i++) {

							if (data[groupName][i] === undefined) {
								continue;
							}

							var item = data[groupName][i];

							if (heightCount + options.itemHeight >= scrollTop && heightCount <= scrollTop + options.listHeight) {

								var itemEl = $(itemTemplate).attr('data-index', i);

								if (isFirstItem) {
									children.append('<div style="height:' + options.itemHeight * i + 'px"></div>');
									isFirstItem = false;
								}

								if (isPlainArrayData(data[groupName])) {

									if (options.multi) {

										if (
											_self._selectedValue[groupName]
											&&
											_self._selectedValue[groupName].filter(function (_valueItem) {
												return _valueItem && item && _valueItem.toString() === item.toString();
											}).length == 1
										) {
											itemEl.find('.jq-select-item-checkbox').prop('checked', true);
										}

									} else {

										itemEl.find('.jq-select-item-checkbox').remove();

										if (
											_self._selectedValue[groupName] && item
											&& _self._selectedValue[groupName].toString() === item.toString()
										) {
											itemEl.addClass('activated');
										}

									}

									itemEl.find('.jq-select-item-name').html(item);

								} else {

									if (options.multi) {

										if (
											_self._selectedValue[groupName]
											&&
											_self._selectedValue[groupName].filter(function (_valueItem) {
												return _valueItem[options.valueField] && item[options.valueField]
													&& _valueItem[options.valueField].toString()
													=== item[options.valueField].toString();
											}).length == 1
										) {
											itemEl.find('.jq-select-item-checkbox').prop('checked', true);
										}

									} else {

										itemEl.find('.jq-select-item-checkbox').remove();

										if (
											_self._selectedValue[groupName]
											&& _self._selectedValue[groupName][options.valueField]
											&& item && item[options.valueField]
											&&
											_self._selectedValue[groupName][options.valueField].toString()
											=== item[options.valueField].toString()
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

							}

							heightCount += options.itemHeight;

						}

						list.append(group);

					} else {
						heightCount += options.groupTitleHeight + options.itemHeight * data[groupName].length;
					}

				}

				var listHeight = 0;
				for (var groupName in data) {
					listHeight += options.groupTitleHeight + options.itemHeight * data[groupName].length;
				}
				list.height(listHeight);

			} else { // not group

				if (!$.isArray(data)) {
					return;
				}

				var isFirstItem = true;

				for (var i = 0, len = data.length; i < len; i++) {

					if (data[i] === undefined) {
						continue;
					}

					if (heightCount > scrollTop + options.listHeight) {
						break;
					}

					if (heightCount + options.itemHeight >= scrollTop && heightCount <= scrollTop + options.listHeight) {

						var item = data[i];

						var itemEl = $(itemTemplate).attr('data-index', i);

						if (isFirstItem) {
							list.append('<div style="height:' + heightCount + 'px"></div>');
							isFirstItem = false;
						}

						if (isPlainArrayData(data)) {

							if (options.multi) {
								_self._selectedValue.filter(function (_valueItem) {
									return _valueItem && item && _valueItem.toString() === item.toString();
								}).length == 1 && itemEl.find('.jq-select-item-checkbox').prop('checked', true);
							} else {
								itemEl.find('.jq-select-item-checkbox').remove();
								_self._selectedValue && item && _self._selectedValue.toString() === item.toString()
								&& itemEl.addClass('activated');
							}

							itemEl.find('.jq-select-item-name').html(item);

						} else {

							if (options.multi) {
								_self._selectedValue.filter(function (_valueItem) {
									return _valueItem[options.valueField] && item[options.valueField]
										&& _valueItem[options.valueField].toString() === item[options.valueField].toString();
								}).length == 1 && itemEl.find('.jq-select-item-checkbox').prop('checked', true);
							} else {
								itemEl.find('.jq-select-item-checkbox').remove();
								_self._selectedValue[options.valueField] && item[options.valueField]
								&& _self._selectedValue[options.valueField].toString() === item[options.valueField].toString()
								&& itemEl.addClass('activated');
							}

							itemEl.find('.jq-select-item-name').html(item[options.displayField]);

						}

						list.append(itemEl);

					}

					heightCount += options.itemHeight;

				}

				list.height(data.length * options.itemHeight);

			}

			bindSelectEvents();

		}

		function showPopup() {

			_self._listScrollTop = 0;

			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- dropdown -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			dropdown = $(dropdownTemplate).css('min-width', options.triggerWidth);

			if (options.popupWidth === 'auto') {
				dropdown.css('width', 'auto');
			} else if (!isNaN(options.popupWidth)) {
				dropdown.width(options.popupWidth);
			}
			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- dropdown -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- filter -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			if (options.hideFilter) {
				dropdown.find('.jq-select-filter').remove();
			} else {
				dropdown.find('.jq-select-filter').val(_self._filterText);
			}
			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- filter -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Select All -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			if (!options.multi || options.hideSelectAll) {
				dropdown.find('.jq-select-select-all').remove();
			} else {
				dropdown.find('.jq-select-select-all-name').html(options.selectAllText);
			}
			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Select All -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- buttons -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			var buttons = dropdown.find('.jq-select-buttons'),
				okButton = dropdown.find('.jq-select-buttons-ok'),
				clearButton = dropdown.find('.jq-select-buttons-clear'),
				closeButton = dropdown.find('.jq-select-buttons-close'),
				buttonsCount = 0;

			// ok button
			if (options.hideOKButton) {
				okButton.remove();
			} else {
				okButton.html(options.okButtonText);
				buttonsCount++;
			}

			// clear button
			if (options.hideClearButton) {
				clearButton.remove();
			} else {
				clearButton.html(options.clearButtonText);
				buttonsCount++;
			}

			// close button
			if (options.hideCloseButton) {
				closeButton.remove();
			} else {
				closeButton.html(options.closeButtonText);
				buttonsCount++;
			}

			if (buttonsCount === 0) {
				buttons.remove();
			} else {
				buttons.addClass('buttons-' + buttonsCount);
			}
			// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- buttons -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

			resetPopupPosition(dropdown);

			// append to body
			wrapper.append(dropdown);

			if (_self._filterText) {
				_self._filterData = getFilteredData();
				renderPopupList({
					data: _self._filterData
				});
			} else {
				renderPopupList();
			}

		};

		function removePopup() {
			wrapper.children('.jq-select-popup').remove();
		};

		function bindFilterEvents() {

			wrapper.find('.jq-select-filter').bind('input', function (e) {

				_self._filterText = e.target.value;

				if (!_self._filterText) {
					renderPopupList();
					resetPopupPosition();
					return;
				}

				_self._filterData = getFilteredData()
				renderPopupList({
					data: _self._filterData
				});
				resetPopupPosition();

			});

		};

		function bindSelectEvents() {

			// select all
			wrapper.find('.jq-select-select-all').change(function (e) {

				e.stopPropagation();

				if (!options.data || !options.multi) {
					return;
				}

				var selectedItems = [];
				var checkbox = $(this).children('input[type="checkbox"]');
				var checked = checkbox.prop('checked');

				wrapper.find('.jq-select-select-all-name').html(checked ? options.deselectAllText : options.selectAllText);

				if (options.group) {
					var data = $.extend(true, {}, options.data);
					for (var i in data) {
						selectedItems = selectedItems.concat(data[i]);
					}
				} else {
					selectedItems = $.extend(true, [], options.data);
				}

				if (checked) {

					if (options.group) {
						_self._selectedValue = $.extend(true, {}, options.data);
					} else {
						_self._selectedValue = $.extend(true, [], options.data);
					}

					onSelect(selectedItems);

				} else {

					if (options.group) {
						_self._selectedValue = {};
					} else {
						_self._selectedValue = [];
					}

					onDeselect(selectedItems);

				}

				renderPopupList({
					scrollTop: _self._listScrollTop
				});

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

				var selectedItems = $.extend(true, [], options.data[groupName]);

				if (checked) {

					var items = $.extend(true, [], options.data[groupName]);
					_self._selectedValue[groupName] = items;

					onSelect(selectedItems);

				} else {

					_self._selectedValue[groupName] && delete _self._selectedValue[groupName];

					onDeselect(selectedItems);

				}

				renderPopupList({
					scrollTop: _self._listScrollTop
				});

			});

			// select item
			if (options.multi) {
				wrapper.find('.jq-select-item').change(function (e) {

					e.stopPropagation();

					if (!options.data) {
						return;
					}

					var checked = $(this).children('input[type="checkbox"]').prop('checked');

					var selectedItem;

					if (options.group) {

						var group = $(this).parents('.jq-select-group');
						var groupName = group.attr('data-name');

						if (!options.data[groupName]) {
							return;
						}

						var index = $(this).attr('data-index');
						selectedItem = options.data[groupName][index];

						if (checked) {
							if (!_self._selectedValue[groupName]) {
								_self._selectedValue[groupName] = [];
							}
							_self._selectedValue[groupName].push(selectedItem);
						} else {
							if (_self._selectedValue[groupName]) {
								_self._selectedValue[groupName] = _self._selectedValue[groupName].filter(function (item) {
									if (isPlainArrayData(_self._selectedValue[groupName])) {
										return item !== selectedItem;
									} else {
										return item[options.valueField] !== selectedItem[options.valueField];
									}
								});
							}
						}

					} else {

						var index = $(this).attr('data-index');
						selectedItem = options.data[index];

						if (checked) {
							_self._selectedValue.push(selectedItem);
						} else {
							_self._selectedValue = _self._selectedValue.filter(function (item) {
								if (isPlainArrayData(_self._selectedValue)) {
									return item !== selectedItem;
								} else {
									return item[options.valueField] !== selectedItem[options.valueField];
								}
							});
						}

					}

					if (checked) {
						onSelect([selectedItem]);
					} else {
						onDeselect([selectedItem]);
					}

					renderPopupList({
						scrollTop: _self._listScrollTop
					});

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

						selectedItem = options.data[groupName][$(this).attr('data-index')];
						_self._selectedValue = {};
						_self._selectedValue[groupName] = selectedItem;

					} else {
						selectedItem = options.data[$(this).attr('data-index')];
						_self._selectedValue = selectedItem;
					}

					wrapper.find('.jq-select-item').removeClass('activated');
					$(this).addClass('activated');
					onSelect(selectedItem);

					renderPopupList({
						scrollTop: _self._listScrollTop
					});

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

			wrapper.find('.jq-select-buttons-clear').mousedown(function (e) {

				e.stopPropagation();

				if (options.multi) {

					var selectedItems = [];

					if (options.group) {
						for (var groupName in _self._selectedValue) {
							selectedItems = selectedItems.concat(_self._selectedValue[groupName]);
						}
					} else {
						selectedItems = _self._selectedValue;
					}

					onDeselect(selectedItems);

				}

				_self._selectedValue = !options.group && options.multi ? [] : {};
				renderPopupList({
					scrollTop: _self._listScrollTop
				});

			});

			wrapper.find('.jq-select-buttons-close').mousedown(function (e) {

				e.stopPropagation();

				removePopup();
				wrapper.removeClass('activated');

				closehandle();

			});

		};

		function bindScrollEvents() {
			wrapper.find('.jq-select-list').scroll(function (e) {
				e.stopPropagation();
				_self._listScrollTop = e.target.scrollTop;
				renderPopupList({
					scrollTop: e.target.scrollTop
				});
			});
		}

		function onSelect(items) {
			options.onSelect && options.onSelect(items);
			triggerChange();
		};

		function onDeselect(items) {
			options.onDeselect && options.onDeselect(items);
			triggerChange();
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
				_self._selectedValue = $.extend(true, {}, result);
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
				_self._selectedValue = $.extend(true, [], result);
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
				_self._selectedValue = $.extend(true, {}, result);
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
					_self._selectedValue = $.extend(true, {}, result);
					_self._value = $.extend(true, {}, result);
				} else {
					_self._selectedValue = result;
					_self._value = result;
				}

			}

		}

		function triggerChange() {

			if (!options.data) {
				return;
			}

			if (options.multi && options.group) { // multi & group

				var count = 0;
				for (var groupName in _self._selectedValue) {
					count += _self._selectedValue[groupName].length;
				}
				if (count > 0) {
					trigger.children('.jq-select-text').html(count + ' selected');
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}

				if (JSON.stringify(_self._value) != JSON.stringify(_self._selectedValue)) {
					options.onChange && options.onChange(_self._selectedValue);
					_self._value = $.extend(true, {}, _self._selectedValue);
				}

			} else if (options.multi && !options.group) { // multi & not group

				var count = _self._selectedValue.length;
				if (count > 0) {
					trigger.children('.jq-select-text').html(count + ' selected');
				} else {
					trigger.children('.jq-select-text').html(options.noSelectText);
				}

				if (JSON.stringify(_self._value) != JSON.stringify(_self._selectedValue)) {
					options.onChange && options.onChange(_self._selectedValue);
					_self._value = $.extend(true, [], _self._selectedValue);
				}

			} else if (!options.multi && options.group) { // single & group

				var item;
				for (var groupName in _self._selectedValue) {
					item = _self._selectedValue[groupName];
				}
				trigger.children('.jq-select-text').html($.isPlainObject(item) ? item[options.displayField] : item);

				if (JSON.stringify(_self._value) != JSON.stringify(_self._selectedValue)) {
					options.onChange && options.onChange(_self._selectedValue);
					_self._value = $.extend(true, {}, _self._selectedValue);
				}

			} else { // single & not group

				if ($.isPlainObject(_self._selectedValue)) {

					trigger.children('.jq-select-text').html(_self._selectedValue[options.displayField]);

					if (JSON.stringify(_self._value) !== JSON.stringify(_self._selectedValue)) {
						options.onChange && options.onChange(_self._selectedValue);
						_self._value = $.extend(true, {}, _self._selectedValue);
					}

				} else {

					trigger.children('.jq-select-text').html(_self._selectedValue);

					if (_self._value !== _self._selectedValue) {
						options.onChange && options.onChange(_self._selectedValue);
						_self._value = _self._selectedValue;
					}

				}

			}

			renderPopupList({
				scrollTop: _self._listScrollTop
			});

			if (options.autoClose) {

				removePopup();

				if (wrapper.hasClass('activated')) {
					wrapper.removeClass('activated');
					closehandle();
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
					closehandle();
					return;
				}

				if (!_self._isLoading) {

					wrapper.addClass('activated');

					showPopup();

					bindFilterEvents();

					bindButtonsEvents();

					bindScrollEvents();

				}

			} else if ($(e.target).parents('.jq-select-wrapper').length == 0
				|| !$(e.target).parents('.jq-select-wrapper').is(wrapper)) {

				e.stopPropagation();

				removePopup();

				if (wrapper.hasClass('activated')) {
					wrapper.removeClass('activated');
					closehandle();
				}

			}

		}

		function resizeHandle() {
			resetPopupPosition();
		}

		function closehandle() {
			_self._selectedValue = $.extend(true, !options.group && options.multi ? [] : {}, _self._value);
			options.onClose && options.onClose();
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
		listHeight: 300,
		groupTitleHeight: 30,
		itemHeight: 30,

		hideFilter: false,

		hideSelectAll: false,
		selectAllText: 'Select All',
		deselectAllText: 'Deselect All',

		hideOKButton: false,
		okButtonText: 'OK',
		hideClearButton: false,
		clearButtonText: 'Clear',
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