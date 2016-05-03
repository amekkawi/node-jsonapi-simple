"use strict";

var util = require('./../util/index');
var membersUtil = require('../util/members');
var pointerUtil = require('./../util/json-pointer');
var BaseObject = require('./base-object');
var LinkObject = require('./link-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = LinksObject;

function LinksObject(obj) {
	MetaObject.call(this, obj);
}

util.inherits(LinksObject, MetaObject);

LinksObject.prototype.parse = function(key, value) {
	if (util.isObject(value) && !(value instanceof BaseObject))
		return new LinkObject(value);

	return value;
};

LinksObject.prototype.validate = function(pointer, options) {
	MetaObject.prototype.validate.call(this, pointer, options);

	var keys = Object.keys(this.props);
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		var value = this.props[keys[i]];

		var valType = typeof value;
		if (valType !== 'string') {
			if (!value || valType !== 'object' || Array.isArray(value))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string or link object', key, pointer);

			membersUtil.validateMemberValue(pointerUtil.addToken(pointer, key), value, options);
		}
	}

	return this;
};

LinksObject.prototype.toJSON = function() {
	var propKeys = Object.keys(this.props);
	var ret = {};
	for (var i = 0, l = propKeys.length; i < l; i++) {
		var key = propKeys[i];
		var value = this.props[key];
		if (value instanceof BaseObject) {
			ret[key] = value.toJSON();
		}
		else {
			ret[key] = value;
		}

	}
	return ret;
};
