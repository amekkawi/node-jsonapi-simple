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
		//if (process.env.NODE_ENV !== 'production' && member.validate)
		//	member.validate(value);

		if (member.parse)
			value = member.parse.call(apiObject, value, key);

		var destArr = dest[key];
		if (!exports.isArray(destArr)) {
			destArr = dest[key] = destArr ? [destArr] : [];
		}

		destArr.push(value);
	}
	else if (process.env.NODE_ENV !== 'production') {
		throw new InvalidMemberError(exports.getProtoName(apiObject), key);
	}
};

exports.setMember = function(key, value, dest, members, apiObject) {
	var member = members[key];
	if (member) {
		//if (process.env.NODE_ENV !== 'production' && member.validate)
		//	member.validate(value);

		if (member.parse)
			value = member.parse(value);

		dest[key] = value;
	}
	else if (process.env.NODE_ENV !== 'production') {
		throw new InvalidMemberError(util.getProtoName(apiObject), key);
	}
};

exports.createSetters = function(keys, proto) {
	exports.forEach.call(keys, function(key) {
		proto['set' + exports.upperFirst(key)] = function(value) {
			return this.set(key, value);
		};
	});
};

exports.addMembersToPrototype = function(proto, members) {
	proto.members = members;
	proto.memberKeys = exports.objectKeys(members);
	exports.createSetters(proto.memberKeys, proto);
};

exports.validateMemberValue = function(key, value, options) {
	try {
		value.validate(options);
	}
	catch (err) {
		if (err instanceof InvalidMemberError || err instanceof InvalidMemberValueError)
			err.memberPath = (exports.isArray(key) ? key : [key]).concat(err.memberPath || []);
		throw err;
	}
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
