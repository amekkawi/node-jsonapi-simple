"use strict";

var util = require('../util');
var BaseObject = require('./base-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = LinkObject;

function LinkObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(LinkObject, BaseObject.prototype);

util.addMembersToPrototype(LinkObject.prototype, {
	href: {
		validate: function(value, key) {
			if (typeof value === 'undefined')
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key);
		}
	},
	meta: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof MetaObject))
				return new MetaObject(value);
			return value;
		},
		validate: function(value, key) {
			if (typeof value === 'undefined')
				return;

			if (!(value instanceof MetaObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			util.validateMemberValue(key, value, options);
		}
	}
});
