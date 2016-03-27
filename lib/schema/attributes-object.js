"use strict";

var util = require('./../util');
var MetaObject = require('./meta-object');
var InvalidMemberError = require('../errors/invalid-member-error');

module.exports = AttributesObject;

function AttributesObject(obj) {
	MetaObject.call(this, obj);
}

util.superClass(AttributesObject, MetaObject.prototype);

function forEachProperty(obj, fn, deep) {
	if (deep === true)
		deep = [];

	var keys = Object.keys(obj);
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		var value = obj[key];
		fn(key, value, obj, deep);

		if (deep && value && typeof value === 'object')
			forEachProperty(value, fn, deep.concat([key]));
	}
}

// TODO: Throw error if "relationships" or "links" attributes are set?
AttributesObject.prototype.validate = function(options) {
	MetaObject.prototype.validate(options);
	forEachProperty(this.props, function(key, v, o, path) {
		if (key === 'relationships' || key === 'links')
			throw new InvalidMemberError(key, path.concat([key]));
	}, true);

	return this;
	// TODO: Throw error if "relationships" or "links" attributes are set?
};
