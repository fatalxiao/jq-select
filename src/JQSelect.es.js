(function ($) {

    const JQSelectList = {

        list: [],

        add: function (select) {
            this.list.push(select);
        },

        destroy: function (originEl) {

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

    const wrapTemplate = '<div class="jq-select-wrapper"/>',

        triggerTemplate = '<button type="button" class="jq-select-trigger"></button>',

        getPopupTemplate = (options) => {
            return (
                `<div class="jq-select-popup">

                     <div class="jq-select-filter-wrapper">
                         <input type="text" 
                                class="jq-select-filter" 
                                placeholder="${options.filterPlaceholder}"/>
                         <i class="jq-select-filter-icon ${options.filterIconCls}"></i>
                     </div>
                     
                     <label type="text" 
                            class="jq-select-select-all">
                         <input type="checkbox" 
                                class="jq-select-checkbox jq-select-select-all-checkbox ${options.checkboxIconCls}"/>
                         <span class="jq-select-select-all-name">${options.selectAllText}</span>
                     </label>
                     
                     <div class="jq-select-list">
                         <div class="jq-select-list-scroller"></div>
                     </div>
                     
                 </div>`
            );
        },

        getItemTemplate = (options) => {
            return (
                `<label class="jq-select-item">
                     <input type="checkbox" 
                            class="jq-select-checkbox jq-select-item-checkbox"/>
                     <i class="jq-select-item-icon"></i>
                     <span class="jq-select-item-name"></span>
                 </label>`
            );
        },

        rangeValid = (value, min, max) => {
            max !== undefined && (value = value > max ? max : value);
            min !== undefined && (value = value < min ? min : value);
            return value;
        },

        triggerPopupEventHandle = (el, triggerEl, popupEl, currentVisible) => {

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

        formatData = (data) => {
            let index = 0;
            return data.map(item => ({
                rawValue: item,
                jqSelectIndex: index++
            }));
        },

        calDisplayIndex = (data, scrollTop, options) => {

            const len = data.length;

            let start = Math.floor(scrollTop / options.itemHeight),
                stop = start + Math.ceil(options.listHeight / options.itemHeight);

            start -= options.renderBuffer;
            stop += options.renderBuffer;

            return {
                start: rangeValid(start, 0, len - 1),
                stop: rangeValid(stop, 0, len - 1)
            };

        },

        getValue = (data, valueField, displayField) => {
            return typeof data == 'object' ?
                (data[valueField] || data[displayField])
                :
                data;
        },

        getDisplay = (data, valueField, displayField) => {
            return typeof data == 'object' ?
                (data[displayField] || data[valueField])
                :
                data;
        },

        isChecked = (value, data, valueField, displayField) => {

            if (!value || value.length < 1 || !data) {
                return false;
            }

            for (let item of value) {
                if (getValue(item, valueField, displayField) === getValue(data, valueField, displayField)) {
                    return true;
                }
            }

            return false;

        },

        filterData = (data, filterText, valueField, displayField) => {

            if (!filterText) {
                return data;
            }

            return data.filter((item) =>
                getDisplay(item.rawValue, valueField, displayField).toString().toUpperCase()
                    .includes(filterText.toString().toUpperCase()));

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

        if (this.options.data) {
            this.data = formatData(this.options.data);
            return;
        }

        if (!this.originEl) {
            return;
        }

        const options = this.originEl.children('option');
        if (options && options.length > 0) {

            this.data = [];
            let i = 0;

            options.each(() => {
                this.data.push({
                    rawValue: {
                        [this.options.valueField]: $(this).val(),
                        [this.options.displayField]: $(this).html()
                    },
                    jqSelectIndex: i++
                });
            });

        }

    };

    JQSelect.prototype.renderList = function (scrollTop = 0) {

        const startTime = new Date().getTime();

        if (!this.popupEl) {
            return;
        }

        const scroller = this.popupEl.find('.jq-select-list-scroller'),
            filteredData = filterData(this.data, this.filterText, this.options.valueField, this.options.displayField);

        if (!filteredData || filteredData.length < 1) {
            scroller.html('');
            return;
        }

        const itemHeight = this.options.itemHeight,
            {start, stop} = calDisplayIndex(filteredData, scrollTop, this.options),
            list = [];

        for (let i = start; i <= stop; i++) {

            const rawValue = filteredData[i].rawValue,
                index = filteredData[i].jqSelectIndex;

            let item = scroller.children(`.jq-select-item[jq-select-index=${index}]`);

            // if exist
            if (item[0]) {
                item.css({
                    transform: `translate(0, ${i * itemHeight}px)`
                });
                continue;
            }

            item = $(getItemTemplate(this.options))
                .attr('jq-select-index', index)
                .css({
                    height: itemHeight,
                    lineHeight: `${itemHeight}px`,
                    transform: `translate(0, ${i * itemHeight}px)`
                });

            // icon
            const iconCls = rawValue[this.options.iconClsField];
            if (iconCls) {
                item.children('.jq-select-item-icon').addClass(iconCls);
            } else {
                item.children('.jq-select-item-icon').remove();
            }

            // checked
            if (!this.options.multi) {
                item.children('.jq-select-checkbox').remove();
            } else if (isChecked(this.value, rawValue, this.options.valueField, this.options.displayField)) {
                item.children('.jq-select-item-checkbox').prop('checked', true);
            }

            // display text
            item.children('.jq-select-item-name').html(rawValue[this.options.displayField]);

            item.mousedown(() => {

                if (!this.value || this.value.length < 1 || !rawValue) {
                    this.value = [rawValue];
                } else if (isChecked(this.value, rawValue, this.options.valueField, this.options.displayField)) {
                    this.value.splice(i, 1);
                } else {
                    this.value.push(rawValue);
                }

                this.popupEl.find('.jq-select-select-all-checkbox')
                    .prop('checked', this.value.length === filteredData.length);

            });

            list.push(item);

        }

        scroller.children().each(function () {

            const index = parseInt($(this).attr('jq-select-index'));

            const data = filteredData.slice(start, stop);
            let flag = false;

            for (let i = 0, len = data.length; i < len; i++) {
                if (index === data[i].jqSelectIndex) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                $(this).remove();
            }

        });

        scroller.css({
            height: filteredData.length * this.options.itemHeight
        }).append(list);

        console.log('render spend:', new Date().getTime() - startTime, 'ms');

    };

    JQSelect.prototype.showPopup = function () {

        if (!this.triggerEl) {
            return;
        }

        if (!this.popupEl) {
            this.popupEl = $(getPopupTemplate(this.options)).appendTo('body');
            this.popupEl.children('.jq-select-list').on('scroll', this.scrollHandler.bind(this));
        } else {
            this.popupEl.removeClass('hidden');
        }

        const offset = this.triggerEl.offset();
        this.popupEl.css({
            transform: `translate(${offset.left}px, ${offset.top + this.triggerEl.height()}px)`
        });
        this.wrapperEl.addClass('activated');

        // filter
        const filterEl = this.popupEl.children('.jq-select-filter-wrapper');
        if (this.options.enableFilter) {
            filterEl.children('.jq-select-filter').on('input', (e) => {
                this.filterText = e.target.value;
                this.renderList();
            });
        } else {
            filterEl.remove();
        }

        // select all
        const selectAllEl = this.popupEl.children('.jq-select-select-all');
        if (this.options.enableSelectAll) {

            const checkboxEl = selectAllEl.children('.jq-select-select-all-checkbox');

            checkboxEl.prop('checked', this.value.length === this.data.length);

            selectAllEl.mousedown(() => {
                const checked = !checkboxEl.is(':checked');
                this.value = checked ? this.data.map(item => item.rawValue) : [];
                this.popupEl.find('.jq-select-item-checkbox').prop('checked', checked);
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
        this.triggerEl.html(
            '<span class="jq-select-text" title="'
            + this.options.noSelectText + '">'
            + this.options.noSelectText + '</span>'
        );

        this.initData();

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
        filterIconCls: '',
        filterPlaceholder: 'filter ...',
        keepFilter: false,

        enableSelectAll: false,
        selectAllText: 'Select All',
        deselectAllText: 'Deselect All',

        itemActivatedCls: 'activated',

        autoClose: false,

        onSelect: null,
        onDeselect: null,
        onChange: null

    };

}(jQuery));