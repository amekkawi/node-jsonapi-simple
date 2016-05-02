"use strict";

var util = require('../util');
var Pointer = require('../util/json-pointer');
var BaseObject = require('./base-object');
var BaseMembersObject = require('./base-members-object');
var LinksObject = require('./links-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = ErrorObject;

function ErrorObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.inherits(ErrorObject, BaseMembersObject);

util.addMembersToPrototype(ErrorObject.prototype, {
	id: {},
	links: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof BaseObject))
				return new LinksObject(value);
			return value;
		},
		validate: function(value, key, parentPointer, options) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!(value instanceof LinksObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (LinksObject)', key, parentPointer);

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options)
		}
	},
	status: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	code: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key, parentPointer))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	title: {},
	detail: {},
	source: {
		validate: function(value, key, parentPointer) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!util.isObject(value))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key, parentPointer);

			if (util.hasOwnProperty(value, 'pointer') && typeof value.pointer !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', 'pointer', Pointer.addToken(parentPointer, key));

			if (util.hasOwnProperty(value, 'parameter') && typeof value.parameter !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', 'parameter', Pointer.addToken(parentPointer, key));

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
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!(value instanceof MetaObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (MetaObject)', key, parentPointer);

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options);
		}
	}
});
