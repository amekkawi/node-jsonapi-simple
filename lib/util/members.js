"use strict";

var util = require('./index');
// var InvalidMemberError = require('./errors/invalid-member-error');
var hasOwnProperty = Object.prototype.hasOwnProperty;

exports.mergeMembers = function(source, dest, members, memberKeys, apiObject) {
	var keys = memberKeys || Object.keys(source);
	for (var i = 0, l = keys.length; i < l; i++) {
		if (hasOwnProperty.call(source, keys[i]))
			exports.setMember(keys[i], source[keys[i]], dest, members, apiObject);
	}
};

exports.pushMember = function(key, value, dest, members, apiObject) {
	var member = members[key];
	if (member && member.push) {
		if (member.parse)
			value = member.parse.call(apiObject, value, key);

		var destArr = dest[key];
		if (!Array.isArray(destArr)) {
			destArr = dest[key] = destArr ? [destArr] : [];
		}

		destArr.push(value);
	}
	// else if (process.env.NODE_ENV !== 'production') {
	// 	throw new InvalidMemberError(util.getProtoName(apiObject), key);
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
	// 	throw new InvalidMemberError(util.getProtoName(apiObject), key);
	// }
};

exports.createPassthruMethods = function(keys, proto, prefix, fnName) {
	keys.forEach(function(key) {
		proto[prefix + util.upperFirst(key)] = function(value) {
			return this[fnName](key, value);
		};
	});
};

exports.addMembersToPrototype = function(proto, members) {
	proto.members = members;
	proto.memberKeys = Object.keys(members);

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
