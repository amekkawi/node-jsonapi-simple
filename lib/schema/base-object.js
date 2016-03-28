"use strict";

var util = require('./../util');

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

BaseObject.addMembersToPrototype = function(proto, members) {
	proto.members = members;
	proto.memberKeys = util.objectKeys(members);
	util.createSetters(proto.memberKeys, proto);
};
