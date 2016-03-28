"use strict";

var util = require('./../util');
var BaseObject = require('./base-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = ResourceIdentifierObject;

function ResourceIdentifierObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(ResourceIdentifierObject, BaseObject.prototype);

util.addMembersToPrototype(ResourceIdentifierObject.prototype, {
	type: {
		validate: function(value, key) {
			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key);
		}
	},
	id: {
		validate: function(value, key) {
			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key);
		}
	},
	meta: {
		toJSON: true,
		parse: function(value) {
			if (value && typeof value === 'object' && !(value instanceof MetaObject))
				return new MetaObject(value);
			return value;
		},
		validate: function(value, key) {
			if (typeof value === 'undefined')
				return;

			if (!(value instanceof MetaObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			util.validateMemberValue(key, value, options)
		}
	}
});
