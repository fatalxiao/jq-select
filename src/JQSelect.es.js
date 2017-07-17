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

        calDisplayIndex = (data, scrollTop, options) => {

            const len = data.length;

            let start = Math.floor(scrollTop / options.itemHeight),
                stop = start + Math.ceil(options.listHeight / options.itemHeight);

            start -= options.renderBuffer;
            stop += options.renderBuffer;

            return {
                start: rangeValid(start, 0, len),
                stop: rangeValid(stop, 0, len)
            };

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
        this._value = !this.options.group && this.options.multi ? [] : {};
        this._selectedValue = !this.options.group && this.options.multi ? [] : {};
        this._filterText = '';
        this._filterData = null;
        this._listScrollTop = 0;
        this._renderTimeoutIds = null;

        this.init();

        return {
            jQSelect: _self,
            originEl: originEl
        };

    }

    JQSelect.prototype.initData = function () {

        if (this.options.data) {
            this.data = this.options.data;
        }

        if (!this.originEl) {
            return;
        }

        const options = this.originEl.children('option');
        if (options && options.length > 0) {

            this.data = [];

            options.each(() => {
                this.data.push({
                    [this.options.valueField]: $(this).val(),
                    [this.options.displayField]: $(this).html()
                });
            });

        }

    };

    JQSelect.prototype.renderList = function (scrollTop = 0) {

        if (!this.popupEl || !this.data || this.data.length < 1) {
            return;
        }

        const scroller = this.popupEl.find('.jq-select-list-scroller'),
            len = this.data.length,
            itemHeight = this.options.itemHeight,
            {start, stop} = calDisplayIndex(this.data, scrollTop, this.options);

        const list = [];
        for (let i = start; i <= stop; i++) {

            item = $(getItemTemplate(this.options))
                .attr('jq-select-item-id', i)
                .css({
                    height: itemHeight,
                    lineHeight: `${itemHeight}px`,
                    transform: `translate(0, ${i * itemHeight}px)`
                });

            if (!this.options.multi) {
                item.children('.jq-select-checkbox').remove();
            }

            const iconCls = this.data[this.options.iconClsField];
            if (iconCls) {
                item.children('.jq-select-item-icon').addClass(iconCls);
            } else {
                item.children('.jq-select-item-icon').remove();
            }

            item.children('.jq-select-item-name').html(this.data[i][this.options.displayField]);

            list.push(item);

        }

        scroller.css({
            height: len * this.options.itemHeight
        }).html(list);

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