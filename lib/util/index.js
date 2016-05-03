"use strict";

exports.isObject = function(value) {
	return !!value && typeof value === 'object' && !Array.isArray(value);
};

exports.getProtoName = function(obj) {
	return obj
		&& obj.__proto__
		&& obj.__proto__.constructor
		&& obj.__proto__.constructor.name
		|| null;
};

exports.inherits = function(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	}

	subClass.prototype = Object.create(superClass && superClass.prototype, {
		constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});

	if (superClass) {
		if (Object.setPrototypeOf) {
			Object.setPrototypeOf(subClass, superClass);
		}
		else {
			subClass.__proto__ = superClass;
		}
	}
};

exports.upperFirst = function(str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
};

// exports.objectPick = function(obj, keys) {
// 	var ret = {};
// 	var objKeys = Object.keys(obj);
// 	for (var i = 0, l = objKeys.length; i < l; i++) {
// 		var key = objKeys[i];
// 		if (keys.indexOf(key) >= 0)
// 			ret[key] = obj[key];
// 	}
// 	return ret;
// };

// exports.objectAssign = Object.assign || function(target) {
// 		for (var i = 1; i < arguments.length; i++) {
// 			var source = arguments[i];
// 			for (var key in source) {
// 				if (hasOwnProperty.call(source, key)) {
// 					target[key] = source[key];
// 				}
// 			}
// 		}
// 		return target;
// 	};
