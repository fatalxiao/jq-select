webpackJsonp([0],[function(e,t,i){"use strict";function l(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};i(2),function(e){function t(e,t){var i=this;return this.originEl=e,this.options=t,this.wrapperEl=null,this.triggerEl=null,this.popupEl=null,this.data=null,this.filterText="",this.filteredData=null,this.value=[],this.visible=!1,this.disabled=t.disabled,this.init(),{jQSelect:i,originEl:e}}var i={list:[],add:function(e){this.list.push(e)},destroy:function(e){for(var t=this,i=0,l=t.list.length;i<l;i++)if(t.list[i].originEl.is(e)){t.list[i].jQSelect.destroy();break}t.list.splice(i,1)}},o=function(e){return'<div class="jq-select-popup">\n\n                     <div class="jq-select-filter-wrapper">\n                         <input type="text" \n                                class="jq-select-filter" \n                                placeholder="'+e.filterPlaceholder+'"/>\n                         <i class="jq-select-filter-icon '+e.filterIconCls+'"></i>\n                     </div>\n                     \n                     <label type="text" \n                            class="jq-select-select-all">\n                         <input type="checkbox" \n                                class="jq-select-checkbox jq-select-select-all-checkbox '+e.checkboxIconCls+'"/>\n                         <span class="jq-select-select-all-name">'+e.selectAllText+'</span>\n                     </label>\n                     \n                     <div class="jq-select-list">\n                         <div class="jq-select-list-scroller"></div>\n                     </div>\n                     \n                 </div>'},r=function(e,t,i){return void 0!==i&&(e=e>i?i:e),void 0!==t&&(e=e<t?t:e),e},n=function(t,i,l,s){if(!i)return!0;for(;t;){if(e(t).is(l))return s;if(e(t).is(i))return!s;t=t.parentNode}return!1},a=function(e){var t=0;return e.map(function(e){return{rawValue:e,jqSelectIndex:t++}})},c=function(e,t,i){var l=e.length,s=Math.floor(t/i.itemHeight),o=s+Math.ceil(i.listHeight/i.itemHeight);return s-=i.renderBuffer,o+=i.renderBuffer,{start:r(s,0,l-1),stop:r(o,0,l-1)}},p=function(e,t,i){return"object"==(void 0===e?"undefined":s(e))?e[t]||e[i]:e},d=function(e,t,i){return"object"==(void 0===e?"undefined":s(e))?e[i]||e[t]:e},h=function(e,t,i,l){if(!e||e.length<1||!t)return!1;var s=!0,o=!1,r=void 0;try{for(var n,a=e[Symbol.iterator]();!(s=(n=a.next()).done);s=!0){var c=n.value;if(p(c,i,l)===p(t,i,l))return!0}}catch(e){o=!0,r=e}finally{try{!s&&a.return&&a.return()}finally{if(o)throw r}}return!1},u=function(e,t,i,l){return t?e.filter(function(e){return d(e.rawValue,i,l).toString().toUpperCase().includes(t.toString().toUpperCase())}):e};t.prototype.init=function(){var t=this,i=this.originEl.hasClass("jq-select-formated");i||this.originEl.addClass("jq-select-formated").hide().wrap('<div class="jq-select-wrapper"/>'),this.wrapperEl=this.originEl.parent().toggleClass("multi",this.options.multi).prop("disabled",this.disabled),i?this.triggerEl=this.wrapperEl.children(".jq-select-trigger"):(this.triggerEl=e('<button type="button" class="jq-select-trigger"></button>'),this.wrapperEl.prepend(this.triggerEl)),this.initData(),this.initValue(),this.triggerEl.prop("disabled",this.disabled).find(".jq-select-icon").remove(),this.options.iconCls&&this.triggerEl.find(".jq-select-text").before('<i class="jq-select-icon '+this.options.iconCls+'"></i>'),e(document).on("mousedown",this.mousedownHandler.bind(this)),e(window).on("resize",this.resizeHandler.bind(this)),this.originEl.off().on("enable",function(){return t.disabled=!1,t.triggerEl.prop("disabled",!1),e(this)}).on("disable",function(){return t.disabled=!0,t.triggerEl.prop("disabled",!0),e(this)})},t.prototype.initData=function(){var t=this;if(this.options.data)return void(this.filteredData=this.data=a(this.options.data));if(!this.originEl)return void(this.filteredData=this.data=null);var i=this.originEl.children("option");if(i&&i.length>0){var s=[],o=0;i.each(function(){var i;s.push({rawValue:(i={},l(i,t.options.valueField,e(t).val()),l(i,t.options.displayField,e(t).html()),i),jqSelectIndex:o++})}),this.filteredData=this.data=s}},t.prototype.initValue=function(){if(!this.options.data||this.options.data.length<1||!this.options.value||this.options.value.length<1)this.value=[];else{var e=[],t=!0,i=!1,l=void 0;try{for(var s,o=this.options.value[Symbol.iterator]();!(t=(s=o.next()).done);t=!0){var r=s.value,n=this.options,a=n.valueField,c=n.displayField,d=p(r,a,c),h=!0,u=!1,f=void 0;try{for(var v,g=this.options.data[Symbol.iterator]();!(h=(v=g.next()).done);h=!0){var m=v.value;if(p(m,a,c)===d){e.push(m);break}}}catch(e){u=!0,f=e}finally{try{!h&&g.return&&g.return()}finally{if(u)throw f}}}}catch(e){i=!0,l=e}finally{try{!t&&o.return&&o.return()}finally{if(i)throw l}}this.value=e}this.updateValue()},t.prototype.updateValue=function(){var e=this;if(this.value.length>0){this.triggerEl.html(this.value.length+" selected");var t=this.value.map(function(t){return p(t,e.options.valueField,e.options.displayField)}).join(",");this.originEl.html('<option value="'+t+'" selected="selected"></option>')}else this.triggerEl.html(this.options.noSelectText),this.originEl.html("");this.originEl.trigger("change")},t.prototype.showPopup=function(){var t=this;if(this.triggerEl){this.popupEl?this.popupEl.removeClass("hidden"):(this.popupEl=e(o(this.options)).appendTo("body"),this.popupEl.children(".jq-select-list").on("scroll",this.scrollHandler.bind(this)));var i=this.triggerEl.offset();this.popupEl.css({transform:"translate("+i.left+"px, "+(i.top+this.triggerEl.height())+"px)"}).find(".jq-select-list-scroller").css({height:this.filteredData.length*this.options.itemHeight}),this.popupEl.children(".jq-select-list")[0].scrollTop=0,this.wrapperEl.addClass("activated");var l=this.popupEl.children(".jq-select-filter-wrapper");this.options.enableFilter?l.children(".jq-select-filter").on("input",function(e){t.filterText=e.target.value,t.filteredData=u(t.data,t.filterText,t.options.valueField,t.options.displayField),t.popupEl.children(".jq-select-list")[0].scrollTop=0,t.popupEl.find(".jq-select-list-scroller").css({height:t.filteredData.length*t.options.itemHeight}),t.renderList()}):l.remove();var s=this.popupEl.children(".jq-select-select-all");if(this.options.enableSelectAll){var r=this.value.length===this.data.length,n=s.children(".jq-select-select-all-checkbox");s.toggleClass("activated",r),n.prop("checked",r),s.mousedown(function(){var e=!n.is(":checked");t.value=e?t.data.map(function(e){return e.rawValue}):[],t.popupEl.children(".jq-select-select-all").toggleClass("activated",e),t.popupEl.find(".jq-select-item").toggleClass("activated",e),t.popupEl.find(".jq-select-item-checkbox").prop("checked",e),t.updateValue()})}else s.remove();this.renderList()}},t.prototype.renderList=function(){var t=this,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;if(this.popupEl){var l=this,s=this.popupEl.find(".jq-select-list-scroller");if(!this.filteredData||this.filteredData.length<1)return void s.html("");for(var o=this.options.itemHeight,r=c(this.filteredData,i,this.options),n=r.start,a=r.stop,u=this.options,f=u.valueField,v=u.displayField,g=[],m=n;m<=a;m++){(function(i){var l=t.filteredData[i].rawValue,r=t.filteredData[i].jqSelectIndex,n=s.children(".jq-select-item[jq-select-index="+r+"]");if(n[0])return n.css({transform:"translate(0, "+i*o+"px)"}),"continue";n=e((t.options,'<label class="jq-select-item">\n                     <input type="checkbox" \n                            class="jq-select-checkbox jq-select-item-checkbox"/>\n                     <i class="jq-select-item-icon"></i>\n                     <span class="jq-select-item-name"></span>\n                 </label>')).attr("jq-select-index",r).css({height:o,lineHeight:o+"px",transform:"translate(0, "+i*o+"px)"});var a=l[t.options.iconClsField];a?n.children(".jq-select-item-icon").addClass(a):n.children(".jq-select-item-icon").remove(),t.options.multi?h(t.value,l,f,v)&&(n.children(".jq-select-item-checkbox").prop("checked",!0),n.addClass("activated")):n.children(".jq-select-checkbox").remove(),n.children(".jq-select-item-name").html(d(l,f,v)),n.mousedown(function(){if(!t.value||t.value.length<1||!l)t.value=[l],n.addClass("activated");else if(h(t.value,l,f,v)){for(var e=0,i=t.value.length;e<i;e++)if(p(t.value[e],f,v)===p(l,f,v)){t.value.splice(e,1);break}n.removeClass("activated")}else t.value.push(l),n.addClass("activated");var s=t.value.length===t.filteredData.length;t.popupEl.children(".jq-select-select-all").toggleClass("activated",s),t.popupEl.find(".jq-select-select-all-checkbox").prop("checked",s),t.updateValue()}),g.push(n)})(m)}s.children().each(function(){for(var t=parseInt(e(this).attr("jq-select-index")),i=l.filteredData.slice(n,a+1),s=!1,o=0,r=i.length;o<r;o++)if(t===i[o].jqSelectIndex){s=!0;break}s||e(this).remove()}),s.append(g)}},t.prototype.hidePopup=function(){this.popupEl&&this.popupEl.addClass("hidden"),this.wrapperEl.removeClass("activated"),this.visible=!1},t.prototype.mousedownHandler=function(e){if(this.visible=n(e.target,this.triggerEl,this.popupEl,this.visible),!this.visible)return void this.hidePopup();this.wrapperEl.hasClass("activated")||this.showPopup()},t.prototype.scrollHandler=function(e){this.renderList(e.target.scrollTop)},t.prototype.resizeHandler=function(){},t.prototype.destroy=function(){this.triggerEl.remove(),this.originEl.removeClass("jq-select-formated").unwrap(),this.popupEl&&this.popupEl.remove(),this.popupEl=null},e.fn.JQSelect=function(l){return this.each(function(){i.destroy(e(this)),i.add(new t(e(this),e.extend(!0,{},e.fn.JQSelect.defaults,l)))})},e.fn.JQSelect.defaults={multi:!1,data:null,valueField:"value",displayField:"label",iconClsField:"iconCls",value:null,iconCls:"",noSelectText:"Please select ...",listHeight:300,itemHeight:30,renderBuffer:3,disabled:!1,enableFilter:!1,filterPlaceholder:"filter ...",enableSelectAll:!1,selectAllText:"Select All"}}(jQuery)},function(e,t,i){"use strict";i(0);var l=[{providerHotelCode:"GOOGLE03",id:3,hotelName:"Test's 03"},{providerHotelCode:"GOOGLE19",id:101,hotelName:"google 19"},{providerHotelCode:"GOOGLE20",id:102,hotelName:"google 20"},{providerHotelCode:"GOOGLE21",id:103,hotelName:"google 21"},{providerHotelCode:"GOOGLE22",id:104,hotelName:"google 22"},{providerHotelCode:"GOOGLE23",id:105,hotelName:"google 23"},{providerHotelCode:"GOOGLE24",id:106,hotelName:"google 24"},{providerHotelCode:"GOOGLE25",id:107,hotelName:"google 25"},{providerHotelCode:"GOOGLE26",id:108,hotelName:"google 26"},{providerHotelCode:"GOOGLE27",id:109,hotelName:"google 27"}];$(function(){$("#example1").JQSelect({multi:!0,enableFilter:!0,enableSelectAll:!0,data:l,valueField:"id",displayField:"hotelName",value:[3,103]}),$("#show-value-button").click(function(){console.log($("#example1").val())})})},function(e,t){}],[1]);