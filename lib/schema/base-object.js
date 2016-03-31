"use strict";

var util = require('../util');

module.exports = BaseObject;

function BaseObject(obj) {
	this.props = {};
	if (obj)
		this.set(obj);
}

BaseObject.prototype.set = function(key, value) {
	if (typeof key === 'string') {
		util.setMember(key, value, this.props, this.members, this);
	}
	else {
		util.mergeMembers(key, this.props, this.members, this.memberKeys, this);
	}
	return this;
};

BaseObject.prototype.validate = function(options) {
	options = options || {};
	var keys = this.memberKeys;
	var members = this.members;
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		var member = members[key];
		if (member.validate)
			member.validate.call(this, this.props[key], key, options);
	}
	return this;
};

BaseObject.prototype.toJSON = function() {
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
				ret[key] = member.toJSON(value, key);
			}
			else {
				ret[key] = value;
			}
		}
	}
	return ret;
};
