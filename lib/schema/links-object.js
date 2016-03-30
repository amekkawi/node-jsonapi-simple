"use strict";

var util = require('./../util');
var LinkObject = require('./link-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = LinksObject;

function LinksObject(obj) {
	MetaObject.call(this, obj);
}

util.superClass(LinksObject, MetaObject.prototype);

LinksObject.prototype.parse = function(key, value) {
	if (util.isObject(value) && !(value instanceof LinkObject))
		return new LinkObject(value);

	return value;
};

LinksObject.prototype.validate = function(options) {
	MetaObject.prototype.validate.call(this, options);

	var keys = Object.keys(this.props);
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		var value = this.props[keys[i]];

		var valType = typeof value;
		if (valType !== 'string') {
			if (!value || valType !== 'object' || util.isArray(value))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string or link object', key);

			util.validateMemberValue(key, value, options);
		}
	}

	return this;
};

LinksObject.prototype.toJSON = function() {
	var propKeys = util.objectKeys(this.props);
	var ret = {};
	for (var i = 0, l = propKeys.length; i < l; i++) {
		var key = propKeys[i];
		var value = this.props[key];
		if (value instanceof LinkObject) {
			ret[key] = value.toJSON();
		}
		else {
			ret[key] = value;
		}

	}
	return ret;
};
