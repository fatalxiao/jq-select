# jq-select
A simple dropdown select by jQuery.

## Basic Usage

```js
$('#select').JQSelect(options);
```

### Options

|Property|Type|Default|Description|
|:--|:--|:--|:--|
|multi|Boolean|false|Multi select or not.|
|group|Boolean|false|Group or not.|
|data|Object / Array|null|Object if group is true, Array if group is false. See demo for details.|
|groupPriority|Array / String|null|Group render order.|
|valueField|String|"value"|Select item value.|
|displayField|String|"label"|Select item display label.|
|iconClsField|String|"iconCls"|Select item icon class.|
|value|Object / Array|null|Default value. See demo for details.|
|iconCls|String|""|Trigger icon class.|
|noSelectText|String|"Please select ..."|Trigger display text if no item select.|
|triggerWidth|Number|200||
|popupWidth|Number / String|200|A number or 'auto'.|
|hideFilter|Boolean|false||
|filterIconCls|String|""||
|filterPlaceholder|String|"filter ..."||
|keepFilter|Boolean|false|Whether keep filter text or not when close the popup.|
|hideSelectAll|Boolean|false||
|selectAllText|String|"Select All"||
|deselectAllText|String|"Deselect All"||
|checkboxIconCls|String|"jq-select-checkbox"||
|checkboxActivatedCls|String|"activated"||
|hideOKButton|Boolean|false||
|okButtonText|String|"OK"||
|hideClearButton|Boolean|false||
|clearButtonText|String|"Clear"||
|hideCloseButton|Boolean|false||
|closeButtonText|String|"Close"||
|autoClose|Boolean|false|Close the popup when select item if true.|
|onSelect|Function|null|Select item callback. See demo for details.|
|onDeselect|Function|null|Deselect item callback. See demo for details.|
|onChange|Function|null|Select change callback. See demo for details.|
|onOK|Function|null|OK button callback. See demo for details.|
|onClose|Function|null|Close button callback. See demo for details.|

## Get Value

```js
$('#select').getValue();
```

## Updating Options

```js
$('#select').JQSelect(newOptions).trigger('updateOptions');
```

## Set Loading

```js
$('#select').JQSelect().trigger('loadingStart');
// do something ...
$('#select').JQSelect().trigger('loadingEnd');
```