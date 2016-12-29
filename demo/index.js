function generateRandomArray() {
	var data = [];
	for (var i = 0; i < 10; i++) data.push(Math.random() * 100);
	return data;
}

function generateSimpleArrayData() {
	var data = [];
	for (var i = 0; i < 10; i++) data.push(i);
	return data;
}

function generateObjectArrayData() {
	var data = [];
	for (var i = 0; i < 10; i++) {
		data.push({
			value: 'value' + i,
			label: 'label' + i
		});
	}
	return data;
}

function generateGroupSimpleArrayData() {
	var data = {};
	for (var i = 0; i < 10; i++) {
		var group = [];
		for (var j = 0; j < 10; j++) {
			group.push('' + i + j);
		}
		data['group' + i] = group;
	}
	return data;
}

function generateGroupObjectArrayData() {
	var data = {};
	for (var i = 0; i < 10; i++) {
		var group = [];
		for (var j = 0; j < 10; j++) {
			group.push({
				value: 'value' + i + j,
				label: 'label' + i + j
			});
		}
		data['group' + i] = group;
	}
	return data;
}

function generateGroupObjectArrayDataWithIcon() {
	var data = {};
	var iconClses = ['fa fa-amazon', 'fa fa-android', 'fa fa-apple', 'fa fa-bluetooth', 'fa fa-chrome',
		'fa fa-css3', 'fa fa-drupal', 'fa fa-edge', 'fa fa-facebook-official', 'fa fa-firefox'];
	for (var i = 0; i < 10; i++) {
		var group = [];
		for (var j = 0; j < 10; j++) {
			group.push({
				value: 'value' + i + j,
				label: 'label' + i + j,
				iconCls: iconClses[j]
			});
		}
		data['group' + i] = group;
	}
	return data;
}

function randomText(size) {
	var alphabet = 'abcdefghijklmnopqrstuvwxyz',
		result = [];
	for (var i = 0; i < size; i++) {
		var num = parseInt(Math.random() * 26);
		result.push(alphabet.substr(num, 1));
	}
	return result.join('');
}

function generateGroupObjectArrayDataLargeSize() {
	var data = {};
	for (var i = 0; i < 10; i++) {
		var group = [];
		for (var j = 0; j < 10; j++) {
			group.push({
				value: 'value' + i + j,
				label: randomText(50)
			});
		}
		data['group' + i] = group;
	}
	return data;
}

$(function () {

	$('#single-simple-array').JQSelect({
		multi: false,
		group: false,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		autoClose: true,
		data: generateSimpleArrayData(),
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	$('#single-object-array').JQSelect({
		multi: false,
		group: false,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		autoClose: true,
		data: generateObjectArrayData(),
		value: 'value0',
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	$('#single-group-simple-array').JQSelect({
		multi: false,
		group: true,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		data: generateGroupSimpleArrayData(),
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	$('#single-group-object-array').JQSelect({
		multi: false,
		group: true,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		data: generateGroupObjectArrayData(),
		value: {
			group0: {
				value: 'value01',
				label: 'label01'
			}
		},
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	$('#multi-simple-array').JQSelect({
		multi: true,
		group: false,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		data: generateSimpleArrayData(),
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	$('#multi-object-array').JQSelect({
		multi: true,
		group: false,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		data: generateObjectArrayData(),
		value: ['value0', 'value3'],
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	$('#multi-group-simple-array').JQSelect({
		multi: true,
		group: true,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		data: generateGroupSimpleArrayData(),
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	$('#multi-group-object-array').JQSelect({
		multi: true,
		group: true,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		data: generateGroupObjectArrayData(),
		value: {
			group0: ['value01']
		},
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	// single / loading / buttons
	$('#single-loading-buttons').JQSelect().trigger('loadingStart');
	setTimeout(function () {
		$('#single-loading-buttons').JQSelect({
			data: generateObjectArrayData(),
			hideFilter: true,
			hideSelectAll: true,
			onSelect: function (selectItems) {
				console.log('onSelect: ', selectItems);
			},
			onDeselect: function (selectItems) {
				console.log('onDeselect: ', selectItems);
			},
			onChange: function (value) {
				console.log('onChange: ', value);
			},
			onOK: function () {
				console.log('onOK');
			},
			onClose: function () {
				console.log('onClose');
			}
		}).trigger('updateOptions').trigger('loadingEnd');
	}, 2000);

	// multi / group / buttons / loading
	$('#multi-group-buttons-loading').JQSelect().trigger('loadingStart');
	setTimeout(function () {
		$('#multi-group-buttons-loading').JQSelect({
			multi: true,
			group: true,
			data: generateGroupObjectArrayData(),
			hideFilter: true,
			hideSelectAll: true,
			onSelect: function (selectItems) {
				console.log('onSelect: ', selectItems);
			},
			onDeselect: function (selectItems) {
				console.log('onDeselect: ', selectItems);
			},
			onChange: function (value) {
				console.log('onChange: ', value);
			},
			onOK: function () {
				console.log('onOK');
			},
			onClose: function () {
				console.log('onClose');
			}
		}).trigger('updateOptions').trigger('loadingEnd');
	}, 2000);

	// multi / group / filter / select all
	$('#multi-group-filter-selectall').JQSelect({
		multi: true,
		group: true,
		data: generateGroupObjectArrayData(),
		hideOKButton: true,
		hideCloseButton: true,
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	// icon
	$('#icon').JQSelect({
		multi: true,
		group: true,
		data: generateGroupObjectArrayDataWithIcon(),
		iconCls: 'fa fa-circle-thin',
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

	// updateOptions
	function updateSelect(data) {
		$('#updateoptions').JQSelect({
			data: data,
			iconCls: 'fa fa-circle-thin',
			hideFilter: true,
			hideOKButton: true,
			hideCloseButton: true,
			onSelect: function (selectItems) {
				console.log('onSelect: ', selectItems);
			},
			onDeselect: function (selectItems) {
				console.log('onDeselect: ', selectItems);
			},
			onChange: function (value) {
				console.log('onChange: ', value);
			},
			onOK: function () {
				console.log('onOK');
			},
			onClose: function () {
				console.log('onClose');
			}
		}).trigger('updateOptions');
	}

	updateSelect(generateRandomArray());
	setTimeout(function () {
		updateSelect(generateRandomArray());
		console.log('select "updateoptions" updated');
	}, 2000);

	// large size
	$('#largetsize').JQSelect({
		group: true,
		data: generateGroupObjectArrayDataLargeSize(),
		triggerWidth: 300,
		popupWidth: 'auto',
		hideOKButton: true,
		hideCloseButton: true,
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function () {
			console.log('onOK');
		},
		onClose: function () {
			console.log('onClose');
		}
	});

});