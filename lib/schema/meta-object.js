"use strict";

var util = require('../util');
var BaseObject = require('./base-object');

module.exports = MetaObject;

function MetaObject(obj) {
	BaseObject.call(this, obj);
}

util.inherits(MetaObject, BaseObject);

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

MetaObject.prototype.validate = function(pointer, options) {
	BaseObject.prototype.validate.call(this, pointer, options);

	// TODO: Valiate member names
	// See http://jsonapi.org/format/#document-member-names
	return this;
};
