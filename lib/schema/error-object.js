"use strict";

var util = require('../util/index');
var membersUtil = require('../util/members');
var pointerUtil = require('../util/json-pointer');
var BaseObject = require('./base-object');
var BaseMembersObject = require('./base-members-object');
var LinksObject = require('./links-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');
var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = ErrorObject;

function ErrorObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.inherits(ErrorObject, BaseMembersObject);

membersUtil.addMembersToPrototype(ErrorObject.prototype, {
	id: {},
	links: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof BaseObject))
				return new LinksObject(value);
			return value;
		},
		validate: function(value, key, parentPointer, options) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (!(value instanceof LinksObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (LinksObject)', key, parentPointer);

			membersUtil.validateMemberValue(pointerUtil.addToken(parentPointer, key), value, options)
		}
	},
	status: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	code: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key, parentPointer))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	title: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	detail: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	source: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (!util.isObject(value))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key, parentPointer);

			if (hasOwnProperty.call(value, 'pointer') && typeof value.pointer !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', 'pointer', pointerUtil.addToken(parentPointer, key));

			if (hasOwnProperty.call(value, 'parameter') && typeof value.parameter !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', 'parameter', pointerUtil.addToken(parentPointer, key));

			// TODO: Validate pointer as a JSON Pointer [RFC6901]?
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

			membersUtil.validateMemberValue(pointerUtil.addToken(parentPointer, key), value, options);
		}
	}
});
