"use strict";

var util = require('../util');

module.exports = MetaObject;

function MetaObject(obj) {
	this.props = {};
	if (obj)
		this.set(obj);
}

MetaObject.prototype.toJSON = function() {
	return this.props;
};

MetaObject.prototype.set = function(key, value) {
	if (typeof key === 'string') {
		this.props[key] = this.parse(key, value);
	}
	else {
		var keys = util.objectKeys(key);
		for (var i = 0, l = keys.length; i < l; i++) {
			this.props[keys[i]] = this.parse(keys[i], key[keys[i]]);
		}
	}
	return this;
};

MetaObject.prototype.parse = function(key, value) {
	return value;
};

MetaObject.prototype.validate = function(options) {
	return this;
};
