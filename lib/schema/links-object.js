"use strict";

var util = require('./../util');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = LinksObject;

function LinksObject(obj) {
	MetaObject.call(this, obj);
}

util.superClass(LinksObject, MetaObject.prototype);

LinksObject.prototype.validate = function(options) {
	MetaObject.prototype.validate.call(this, options);

	var keys = Object.keys(this.props);
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		var value = this.props[keys[i]];

		if (value == null || typeof value !== 'string' && typeof value !== 'object')
			throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string or link object', key);

		if (typeof value.href !== 'string' && (value.meta != null && typeof value.meta !== 'object'))
			throw new InvalidMemberValueError(util.getProtoName(this), 'link object must have a href or meta member', key);
	}

	return this;
};
