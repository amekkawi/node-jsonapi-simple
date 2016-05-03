"use strict";

var util = require('./../util/index');
var pointerUtil = require('../util/json-pointer');
var MetaObject = require('./meta-object');
var InvalidMemberError = require('../errors/invalid-member-error');

module.exports = AttributesObject;

function AttributesObject(obj) {
	MetaObject.call(this, obj);
}

util.inherits(AttributesObject, MetaObject);

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

AttributesObject.prototype.validate = function(pointer, options) {
	MetaObject.prototype.validate.call(this, pointer, options);

	if (!options || !options.allowAnyAttributeName) {
		forEachProperty(this.props, function(key, v, o, path) {
			if (key === 'relationships' || key === 'links')
				throw new InvalidMemberError(util.getProtoName(this), key, pointer + pointerUtil.joinTokens(path));
		}.bind(this), true);
	}

	return this;
};
