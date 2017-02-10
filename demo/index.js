function generateRandomArray() {
	var data = [];
	for (var i = 0; i < 10; i++) data.push(Math.random() * 100);
	return data;
}

function generateSimpleArrayData(size) {
	size = size || 10;
	var data = [];
	for (var i = 0; i < size; i++) data.push(i);
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

function generateGroupObjectArrayData(listSize, groupSize) {
	listSize = listSize || 10;
	groupSize = groupSize || 10;
	var data = {};
	for (var i = 0; i < listSize; i++) {
		var group = [];
		for (var j = 0; j < groupSize; j++) {
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

	// single / simple array data
	$('#single-simple-array').JQSelect({
		multi: false,
		group: false,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// single / object array data
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// single / group / simple array data
	$('#single-group-simple-array').JQSelect({
		multi: false,
		group: true,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// single / group / object array data
	$('#single-group-object-array').JQSelect({
		multi: false,
		group: true,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// multi / simple array data
	$('#multi-simple-array').JQSelect({
		multi: true,
		group: false,
		hideFilter: true,
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// multi / object array data / buttons
	$('#multi-object-array-buttons').JQSelect({
		multi: true,
		group: false,
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// multi / group / simple array data
	$('#multi-group-simple-array').JQSelect({
		multi: true,
		group: true,
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// multi / group / object array data
	$('#multi-group-object-array').JQSelect({
		multi: true,
		group: true,
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
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
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
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
			onOK: function (value) {
				console.log('onOK', value);
			},
			onClose: function (value) {
				console.log('onClose', value);
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
			onOK: function (value) {
				console.log('onOK', value);
			},
			onClose: function (value) {
				console.log('onClose', value);
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
		hideClearButton: true,
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
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
		hideClearButton: true,
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	// updateOptions
	function updateSelect(data) {
		$('#update-options').JQSelect({
			data: data,
			iconCls: 'fa fa-circle-thin',
			hideFilter: true,
			hideOKButton: true,
			hideCloseButton: true,
			hideClearButton: true,
			onSelect: function (selectItems) {
				console.log('onSelect: ', selectItems);
			},
			onDeselect: function (selectItems) {
				console.log('onDeselect: ', selectItems);
			},
			onChange: function (value) {
				console.log('onChange: ', value);
			},
			onOK: function (value) {
				console.log('onOK', value);
			},
			onClose: function (value) {
				console.log('onClose', value);
			}
		}).trigger('updateOptions');
	}

	updateSelect(generateRandomArray());
	setTimeout(function () {
		updateSelect(generateRandomArray());
		console.log('select "update-options" updated');
	}, 2000);

	// large size
	$('#large-size').JQSelect({
		group: true,
		data: generateGroupObjectArrayDataLargeSize(),
		triggerWidth: 300,
		popupWidth: 'auto',
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	$('#big-data').JQSelect({
		multi: false,
		group: false,
		hideOKButton: true,
		hideCloseButton: true,
		hideClearButton: true,
		autoClose: true,
		data: generateSimpleArrayData(10000),
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

	$('#big-data-group-multi').JQSelect({
		multi: true,
		group: true,
		data: generateGroupObjectArrayData(100, 100),
		onSelect: function (selectItems) {
			console.log('onSelect: ', selectItems);
		},
		onDeselect: function (selectItems) {
			console.log('onDeselect: ', selectItems);
		},
		onChange: function (value) {
			console.log('onChange: ', value);
		},
		onOK: function (value) {
			console.log('onOK', value);
		},
		onClose: function (value) {
			console.log('onClose', value);
		}
	});

});