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
          getPopupTemplate = options => {
        return `<div class="jq-select-popup">

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
                         <span class="jq-select-select-all-name"></span>
                     </label>
                     
                     <div class="jq-select-list">
                         <div class="jq-select-list-scroller"></div>
                     </div>
                     
                 </div>`;
    },
          getItemTemplate = options => {
        return `<label class="jq-select-item">
                     <input type="checkbox" 
                            class="jq-select-checkbox jq-select-item-checkbox ${options.checkboxIconCls}"/>
                     <i class="jq-select-item-icon"></i>
                     <span class="jq-select-item-name"></span>
                 </label>`;
    },
          triggerPopupEventHandle = (el, triggerEl, popupEl, currentVisible) => {

        if (!triggerEl) {
            return true;
        }

        while (el) {
            if (el == popupEl) {
                return currentVisible;
            } else if (el == triggerEl) {
                return !currentVisible;
            }
            el = el.parentNode;
        }

        return false;
    };

    function JQSelect(originEl, options) {

        var _self = this;

        this.originEl = originEl;
        this.options = options;

        this.wrapperEl = null;
        this.triggerEl = null;
        this.popupEl = null;

        this.visible = false;
        this._value = !this.options.group && this.options.multi ? [] : {};
        this._selectedValue = !this.options.group && this.options.multi ? [] : {};
        this._isLoading = false;
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

    JQSelect.prototype.showPopup = function () {

        this.popupEl = $(getPopupTemplate(this.options));

        const offset = this.triggerEl.offset();

        this.popupEl.css({
            transform: `translate(${offset.left}px, ${offset.top}px)`
        });
    };

    JQSelect.prototype.removePopup = function () {
        this.wrapperEl.removeClass('activated');
    };

    JQSelect.prototype.setLoading = function () {};

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

    JQSelect.prototype.resizeHandler = function () {};

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
        }).on('loadingStart', function () {
            this.setLoading(true);
            return this;
        }).on('loadingEnd', function () {
            this.setLoading(false);
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

        popupWidth: 200,
        minPopupWidth: 200,
        maxPopupWidth: 400,
        listHeight: 300,
        groupTitleHeight: 30,
        itemHeight: 30,
        selectAllHeight: 30,
        filterHeight: 30,
        buttonsHeight: 40,

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
})(jQuery);