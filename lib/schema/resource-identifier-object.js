"use strict";

var util = require('./../util/index');
var membersUtil = require('../util/members');
var pointerUtil = require('../util/json-pointer');
var BaseObject = require('./base-object');
var BaseMembersObject = require('./base-members-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');
var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = ResourceIdentifierObject;

function ResourceIdentifierObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.inherits(ResourceIdentifierObject, BaseMembersObject);

membersUtil.addMembersToPrototype(ResourceIdentifierObject.prototype, {
	type: {
		validate: function(value, key, parentPointer) {
			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	id: {
		validate: function(value, key, parentPointer) {
			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	meta: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof BaseObject))
				return new MetaObject(value);
			return value;
		},
		validate: function(value, key, parentPointer, options) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (!(value instanceof MetaObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (MetaObject)', key, parentPointer);

			membersUtil.validateMemberValue(pointerUtil.addToken(parentPointer, key), value, options)
		}
	}
});
