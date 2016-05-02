"use strict";

var InvalidMemberError = require('./errors/invalid-member-error');
var InvalidMemberValueError = require('./errors/invalid-member-value-error');

exports.objectAssign = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}
		return target;
	};

exports.isArray = Array.isArray.bind(Array);
exports.forEach = Array.prototype.forEach;
exports.objectKeys = Object.keys.bind(Object);
exports.objectFreeze = Object.freeze;
exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
exports.hasOwnProperty = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key)
};

exports.isObject = function(value) {
	return !!value && typeof value === 'object' && !exports.isArray(value);
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

exports.bindMethods = function(obj, keys, proto, privateObj) {
	exports.forEach.call(keys, function(key) {
		if (key[0] === '_')
			return;

		var val = proto[key];
		if (typeof val === 'function') {
			Object.defineProperty(obj, key, {
				enumerable: false,
				configurable: false,
				value: proto[key].bind(privateObj)
			});
		}
	});
};

exports.defineProp = function(obj, key, getter, setter) {
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: false,
		get: getter,
		set: setter
	});
};

exports.jsonMixedGetter = function(key) {
	var val = this[key];
	if (exports.isArray(val)) {
		return val.map(function(entry) {
			return entry.toJSON();
		});
	}
	else {
		return val && val.toJSON();
	}
};

exports.jsonArrayGetter = function(key) {
	var val = this[key];
	if (!exports.isArray(val))
		return val;

	return val && val.map(function(entry) {
		return entry.toJSON();
	});
};

exports.jsonValueGetter = function(key) {
	var val = this[key];
	return val && val.toJSON();
};

exports.mergeMembers = function(source, dest, members, memberKeys, apiObject) {
	var keys = memberKeys || exports.objectKeys(source);
	for (var i = 0, l = keys.length; i < l; i++) {
		if (exports.hasOwnProperty(source, keys[i]))
			exports.setMember(keys[i], source[keys[i]], dest, members, apiObject);
	}
};

exports.pushMember = function(key, value, dest, members, apiObject) {
	var member = members[key];
	if (member && member.push) {
		if (member.parse)
			value = member.parse.call(apiObject, value, key);

		var destArr = dest[key];
		if (!exports.isArray(destArr)) {
			destArr = dest[key] = destArr ? [destArr] : [];
		}

		destArr.push(value);
	}
	// else if (process.env.NODE_ENV !== 'production') {
	// 	throw new InvalidMemberError(exports.getProtoName(apiObject), key);
	// }
};

exports.setMember = function(key, value, dest, members, apiObject) {
	var member = members[key];
	if (member) {
		if (member.parse)
			value = member.parse.call(apiObject, value, key);

		dest[key] = value;
	}
	// else if (process.env.NODE_ENV !== 'production') {
	// 	throw new InvalidMemberError(exports.getProtoName(apiObject), key);
	// }
};

exports.createPassthruMethods = function(keys, proto, prefix, fnName) {
	exports.forEach.call(keys, function(key) {
		proto[prefix + exports.upperFirst(key)] = function(value) {
			return this[fnName](key, value);
		};
	});
};

exports.addMembersToPrototype = function(proto, members) {
	proto.members = members;
	proto.memberKeys = exports.objectKeys(members);

	exports.createPassthruMethods(proto.memberKeys, proto, 'set', 'set');

	exports.createPassthruMethods(proto.memberKeys.filter(function(key) {
		// Note: Identity equality for future proofing
		return members[key].push === true;
	}), proto, 'push', 'push');
};

exports.validateMemberValue = function(pointer, value, options) {
	value.validate(pointer, options);
	if (options && options.validate)
		options.validate(value, pointer, options);
};

exports.objectPick = function(obj, keys) {
	var ret = {};
	var objKeys = exports.objectKeys(obj);
	for (var i = 0, l = objKeys.length; i < l; i++) {
		var key = objKeys[i];
		if (keys.indexOf(key) >= 0)
			ret[key] = obj[key];
	}
	return ret;
};
