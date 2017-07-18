'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function ($) {

    var JQSelectList = {

        list: [],

        add: function add(select) {
            this.list.push(select);
        },

        destroy: function destroy(originEl) {

            var self = this,
                i = 0;

            for (var len = self.list.length; i < len; i++) {
                if (self.list[i].originEl.is(originEl)) {
                    self.list[i].jQSelect.destroy();
                    break;
                }
            }

            self.list.splice(i, 1);
        }

    };

    var wrapTemplate = '<div class="jq-select-wrapper"/>',
        triggerTemplate = '<button type="button" class="jq-select-trigger"></button>',
        getPopupTemplate = function getPopupTemplate(options) {
        return '<div class="jq-select-popup">\n\n                     <div class="jq-select-filter-wrapper">\n                         <input type="text" \n                                class="jq-select-filter" \n                                placeholder="' + options.filterPlaceholder + '"/>\n                         <i class="jq-select-filter-icon ' + options.filterIconCls + '"></i>\n                     </div>\n                     \n                     <label type="text" \n                            class="jq-select-select-all">\n                         <input type="checkbox" \n                                class="jq-select-checkbox jq-select-select-all-checkbox ' + options.checkboxIconCls + '"/>\n                         <span class="jq-select-select-all-name">' + options.selectAllText + '</span>\n                     </label>\n                     \n                     <div class="jq-select-list">\n                         <div class="jq-select-list-scroller"></div>\n                     </div>\n                     \n                 </div>';
    },
        getItemTemplate = function getItemTemplate(options) {
        return '<label class="jq-select-item">\n                     <input type="checkbox" \n                            class="jq-select-checkbox jq-select-item-checkbox"/>\n                     <i class="jq-select-item-icon"></i>\n                     <span class="jq-select-item-name"></span>\n                 </label>';
    },
        rangeValid = function rangeValid(value, min, max) {
        max !== undefined && (value = value > max ? max : value);
        min !== undefined && (value = value < min ? min : value);
        return value;
    },
        triggerPopupEventHandle = function triggerPopupEventHandle(el, triggerEl, popupEl, currentVisible) {

        if (!triggerEl) {
            return true;
        }

        while (el) {
            if ($(el).is(popupEl)) {
                return currentVisible;
            } else if ($(el).is(triggerEl)) {
                return !currentVisible;
            }
            el = el.parentNode;
        }

        return false;
    },
        formatData = function formatData(data) {
        var index = 0;
        return data.map(function (item) {
            return {
                rawValue: item,
                jqSelectIndex: index++
            };
        });
    },
        calDisplayIndex = function calDisplayIndex(data, scrollTop, options) {

        var len = data.length;

        var start = Math.floor(scrollTop / options.itemHeight),
            stop = start + Math.ceil(options.listHeight / options.itemHeight);

        start -= options.renderBuffer;
        stop += options.renderBuffer;

        return {
            start: rangeValid(start, 0, len - 1),
            stop: rangeValid(stop, 0, len - 1)
        };
    },
        getValue = function getValue(data, valueField, displayField) {
        return (typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object' ? data[valueField] || data[displayField] : data;
    },
        getDisplay = function getDisplay(data, valueField, displayField) {
        return (typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object' ? data[displayField] || data[valueField] : data;
    },
        isChecked = function isChecked(value, data, valueField, displayField) {

        if (!value || value.length < 1 || !data) {
            return false;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                if (getValue(item, valueField, displayField) === getValue(data, valueField, displayField)) {
                    return true;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return false;
    },
        filterData = function filterData(data, filterText, valueField, displayField) {

        if (!filterText) {
            return data;
        }

        return data.filter(function (item) {
            return getDisplay(item.rawValue, valueField, displayField).toString().toUpperCase().includes(filterText.toString().toUpperCase());
        });
    };

    function JQSelect(originEl, options) {

        var _self = this;

        this.originEl = originEl;
        this.options = options;

        this.wrapperEl = null;
        this.triggerEl = null;
        this.popupEl = null;

        this.data = null;
        this.visible = false;
        this.value = [];
        this.filterText = '';
        this.filteredData = null;

        this.init();

        return {
            jQSelect: _self,
            originEl: originEl
        };
    }

    JQSelect.prototype.initData = function () {
        var _this = this;

        if (this.options.data) {
            this.filteredData = this.data = formatData(this.options.data);
            return;
        }

        if (!this.originEl) {
            return;
        }

        var options = this.originEl.children('option');
        if (options && options.length > 0) {

            var data = [];
            var i = 0;

            options.each(function () {
                var _rawValue;

                data.push({
                    rawValue: (_rawValue = {}, _defineProperty(_rawValue, _this.options.valueField, $(_this).val()), _defineProperty(_rawValue, _this.options.displayField, $(_this).html()), _rawValue),
                    jqSelectIndex: i++
                });
            });

            this.filteredData = this.data = data;
        }
    };

    JQSelect.prototype.initValue = function () {

        if (!this.options.data || this.options.data.length < 1 || !this.options.value || this.options.value.length < 1) {
            return;
        }

        var result = [];

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.options.value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var item = _step2.value;
                var _options = this.options,
                    valueField = _options.valueField,
                    displayField = _options.displayField,
                    value = getValue(item, valueField, displayField);
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {

                    for (var _iterator3 = this.options.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var dataItem = _step3.value;

                        if (getValue(dataItem, valueField, displayField) === value) {
                            result.push(dataItem);
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        this.value = result;
        this.updateValue();
    };

    JQSelect.prototype.updateValue = function () {
        var _this2 = this;

        var len = this.value.length;

        if (len > 0) {

            this.triggerEl.html(this.value.length + ' selected');

            var value = this.value.map(function (item) {
                return getValue(item, _this2.options.valueField, _this2.options.displayField);
            }).join(',');

            this.originEl.html('<option value="' + value + '" checked="checked"></option>');
        } else {
            this.triggerEl.html(this.options.noSelectText);
            this.originEl.html('');
        }
    };

    JQSelect.prototype.renderList = function () {
        var _this3 = this;

        var scrollTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


        if (!this.popupEl) {
            return;
        }

        var self = this,
            scroller = this.popupEl.find('.jq-select-list-scroller');

        if (!this.filteredData || this.filteredData.length < 1) {
            scroller.html('');
            return;
        }

        var itemHeight = this.options.itemHeight,
            _calDisplayIndex = calDisplayIndex(this.filteredData, scrollTop, this.options),
            start = _calDisplayIndex.start,
            stop = _calDisplayIndex.stop,
            _options2 = this.options,
            valueField = _options2.valueField,
            displayField = _options2.displayField,
            list = [];

        var _loop = function _loop(i) {

            var rawValue = _this3.filteredData[i].rawValue,
                index = _this3.filteredData[i].jqSelectIndex;

            var item = scroller.children('.jq-select-item[jq-select-index=' + index + ']');

            // if exist
            if (item[0]) {
                item.css({
                    transform: 'translate(0, ' + i * itemHeight + 'px)'
                });
                return 'continue';
            }

            item = $(getItemTemplate(_this3.options)).attr('jq-select-index', index).css({
                height: itemHeight,
                lineHeight: itemHeight + 'px',
                transform: 'translate(0, ' + i * itemHeight + 'px)'
            });

            // icon
            var iconCls = rawValue[_this3.options.iconClsField];
            if (iconCls) {
                item.children('.jq-select-item-icon').addClass(iconCls);
            } else {
                item.children('.jq-select-item-icon').remove();
            }

            // checked
            if (!_this3.options.multi) {
                item.children('.jq-select-checkbox').remove();
            } else if (isChecked(_this3.value, rawValue, valueField, displayField)) {
                item.children('.jq-select-item-checkbox').prop('checked', true);
                item.addClass('activated');
            }

            // display text
            item.children('.jq-select-item-name').html(rawValue[displayField]);

            item.mousedown(function () {

                if (!_this3.value || _this3.value.length < 1 || !rawValue) {
                    _this3.value = [rawValue];
                    item.addClass('activated');
                } else if (isChecked(_this3.value, rawValue, valueField, displayField)) {
                    for (var _i = 0, len = _this3.value.length; _i < len; _i++) {
                        if (getValue(_this3.value[_i], valueField, displayField) === getValue(rawValue, valueField, displayField)) {
                            _this3.value.splice(_i, 1);
                            break;
                        }
                    }
                    item.removeClass('activated');
                } else {
                    _this3.value.push(rawValue);
                    item.addClass('activated');
                }

                _this3.popupEl.find('.jq-select-select-all-checkbox').prop('checked', _this3.value.length === _this3.filteredData.length);

                _this3.updateValue();
            });

            list.push(item);
        };

        for (var i = start; i <= stop; i++) {
            var _ret = _loop(i);

            if (_ret === 'continue') continue;
        }

        scroller.children().each(function () {

            var index = parseInt($(this).attr('jq-select-index'));

            var data = self.filteredData.slice(start, stop + 1);
            var flag = false;

            for (var i = 0, len = data.length; i < len; i++) {
                if (index === data[i].jqSelectIndex) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                $(this).remove();
            }
        });

        scroller.append(list);
    };

    JQSelect.prototype.showPopup = function () {
        var _this4 = this;

        if (!this.triggerEl) {
            return;
        }

        if (!this.popupEl) {
            this.popupEl = $(getPopupTemplate(this.options)).appendTo('body');
            this.popupEl.children('.jq-select-list').on('scroll', this.scrollHandler.bind(this));
        } else {
            this.popupEl.removeClass('hidden');
        }

        var offset = this.triggerEl.offset();
        this.popupEl.css({
            transform: 'translate(' + offset.left + 'px, ' + (offset.top + this.triggerEl.height()) + 'px)'
        }).find('.jq-select-list-scroller').css({
            height: this.filteredData.length * this.options.itemHeight
        });
        this.popupEl.children('.jq-select-list')[0].scrollTop = 0;
        this.wrapperEl.addClass('activated');

        // filter
        var filterEl = this.popupEl.children('.jq-select-filter-wrapper');
        if (this.options.enableFilter) {
            filterEl.children('.jq-select-filter').on('input', function (e) {

                _this4.filterText = e.target.value;
                _this4.filteredData = filterData(_this4.data, _this4.filterText, _this4.options.valueField, _this4.options.displayField);

                _this4.popupEl.children('.jq-select-list')[0].scrollTop = 0;
                _this4.popupEl.find('.jq-select-list-scroller').css({
                    height: _this4.filteredData.length * _this4.options.itemHeight
                });

                _this4.renderList();
            });
        } else {
            filterEl.remove();
        }

        // select all
        var selectAllEl = this.popupEl.children('.jq-select-select-all');
        if (this.options.enableSelectAll) {

            var checkboxEl = selectAllEl.children('.jq-select-select-all-checkbox');

            checkboxEl.prop('checked', this.value.length === this.data.length);

            selectAllEl.mousedown(function () {

                var checked = !checkboxEl.is(':checked');

                _this4.value = checked ? _this4.data.map(function (item) {
                    return item.rawValue;
                }) : [];
                _this4.popupEl.find('.jq-select-item-checkbox').prop('checked', checked);

                _this4.updateValue();
            });
        } else {
            selectAllEl.remove();
        }

        this.renderList();
    };

    JQSelect.prototype.removePopup = function () {

        if (this.popupEl) {
            this.popupEl.addClass('hidden');
        }

        this.wrapperEl.removeClass('activated');
        this.visible = false;
    };

    JQSelect.prototype.mousedownHandler = function (e) {

        this.visible = triggerPopupEventHandle(e.target, this.triggerEl, this.popupEl, this.visible);

        if (!this.visible) {
            this.removePopup();
            return;
        }

        if (!this.wrapperEl.hasClass('activated')) {
            this.showPopup();
        }
    };

    JQSelect.prototype.scrollHandler = function (e) {
        this.renderList(e.target.scrollTop);
    };

    JQSelect.prototype.resizeHandler = function () {
        //
    };

    JQSelect.prototype.init = function () {

        // whether select is formated
        var formated = this.originEl.hasClass('jq-select-formated');

        if (!formated) {
            this.originEl.addClass('jq-select-formated').hide().wrap(wrapTemplate);
        }

        this.wrapperEl = this.originEl.parent().toggleClass('multi', this.options.multi);

        if (!formated) {
            this.triggerEl = $(triggerTemplate);
            this.wrapperEl.prepend(this.triggerEl);
        } else {
            this.triggerEl = this.wrapperEl.children('.jq-select-trigger');
        }

        // trigger text
        this.triggerEl.html('<span class="jq-select-text" title="' + this.options.noSelectText + '">' + this.options.noSelectText + '</span>');

        this.initData();
        this.initValue();

        // trigger icon
        this.triggerEl.find('.jq-select-icon').remove();
        if (this.options.iconCls) {
            this.triggerEl.find('.jq-select-text').before('<i class="jq-select-icon ' + this.options.iconCls + '"></i>');
        }

        $(document).on('mousedown', this.mousedownHandler.bind(this));
        $(window).on('resize', this.resizeHandler.bind(this));

        this.originEl.off().on('updateOptions', function () {
            this.options = $.extend(true, {}, $.fn.JQSelect.defaults, this.options);
            return this;
        });
    };

    JQSelect.prototype.destroy = function () {

        this.removePopup();
        this.wrapperEl.removeClass('activated');

        $(document).off('mousedown', this.mousedownHandler);
        $(window).off('resize', this.resizeHandler);
    };

    $.fn.JQSelect = function (options) {
        return this.each(function () {
            JQSelectList.destroy($(this));
            JQSelectList.add(new JQSelect($(this), $.extend(true, {}, $.fn.JQSelect.defaults, options)));
        });
    };

    $.fn.JQSelect.defaults = {

        multi: false,

        data: null,
        valueField: 'value',
        displayField: 'label',
        iconClsField: 'iconCls',
        value: null,

        iconCls: '',
        noSelectText: 'Please select ...',

        listHeight: 300,
        itemHeight: 30,
        renderBuffer: 3,

        enableFilter: false,
        filterPlaceholder: 'filter ...',

        enableSelectAll: false,
        selectAllText: 'Select All',

        itemActivatedCls: 'activated'

    };
})(jQuery);