"use strict";

var util = require('../util');
var BaseObject = require('./base-object');

module.exports = BaseMembersObject;

function BaseMembersObject(obj) {
	BaseObject.call(this, obj);
}

util.inherits(BaseMembersObject, BaseObject);

BaseMembersObject.prototype.push = function(key, value) {
	util.pushMember(key, value, this.props, this.members, this);
	return this;
};

BaseMembersObject.prototype.set = function(key, value) {
	if (typeof key === 'string') {
		util.setMember(key, value, this.props, this.members, this);
	}
	else {
		util.mergeMembers(key, this.props, this.members, this.memberKeys, this);
	}
	return this;
};

BaseMembersObject.prototype.validate = function(pointer, options) {
	BaseObject.prototype.validate.call(this, pointer, options);

	options = options || {};
	var keys = this.memberKeys;
	var members = this.members;
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		var member = members[key];
		if (member.validate)
			member.validate.call(this, this.props[key], key, pointer, options);
	}
	return this;
};

BaseMembersObject.prototype.toJSON = function() {
	var propKeys = util.objectKeys(this.props);
	var ret = {};
	for (var i = 0, l = propKeys.length; i < l; i++) {
		var key = propKeys[i];
		var member = this.members[key];
		if (member) {
			var value = this.props[key];
			if (member.toJSON === true) {
				ret[key] = value && value.toJSON();
			}
			else if (member.toJSON) {
				ret[key] = member.toJSON.call(this, value, key);
			}
			else {
				ret[key] = value;
			}
		}
	}
	return ret;
};
