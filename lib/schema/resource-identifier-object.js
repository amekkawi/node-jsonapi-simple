"use strict";

var util = require('./../util');
var BaseMembersObject = require('./base-members-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = ResourceIdentifierObject;

function ResourceIdentifierObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.superClass(ResourceIdentifierObject, BaseMembersObject.prototype);

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
			if (util.isObject(value) && !(value instanceof MetaObject))
				return new MetaObject(value);
			return value;
		},
		validate: function(value, key, options) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!(value instanceof MetaObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (MetaObject)', key);

			util.validateMemberValue(key, value, options)
		}
	}
});
