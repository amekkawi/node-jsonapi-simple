"use strict";

var InvalidMemberError = require('./errors/invalid-member-error');

exports.isArray = Array.isArray.bind(Array);
exports.forEach = Array.prototype.forEach;
exports.objectKeys = Object.keys.bind(Object);
exports.objectFreeze = Object.freeze;
exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
exports.hasOwnProperty = function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key)
};

exports.superClass = function(childConstructor, superPrototype) {
	childConstructor.prototype = Object.create(superPrototype);
	childConstructor.prototype.constructor = childConstructor;
	return childConstructor;
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

exports.mergeMembers = function(source, dest, members, memberKeys) {
	var keys = memberKeys || util.objectKeys(source);
	for (var i = 0, l = keys.length; i < l; i++) {
		exports.setMember(keys[i], source[keys[i]], dest, members);
	}
};

exports.setMember = function(key, value, dest, members) {
	var member = members[key];
	if (member) {
		//if (process.env.NODE_ENV !== 'production' && member.validate)
		//	member.validate(value);

		if (member.parse)
			value = member.parse(value);

		dest[key] = value;
	}
	else if (process.env.NODE_ENV !== 'production') {
		throw new InvalidMemberError(key);
	}
};

exports.createSetters = function(keys, proto) {
	exports.forEach.call(keys, function(key) {
		proto['set' + exports.upperFirst(key)] = function(value) {
			return this.set(key, value);
		};
	});
};
