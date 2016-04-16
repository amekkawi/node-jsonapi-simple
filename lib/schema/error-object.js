"use strict";

var util = require('../util');
var BaseObject = require('./base-object');
var LinksObject = require('./links-object');
var MetaObject = require('./meta-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = ErrorObject;

function ErrorObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(ErrorObject, BaseObject.prototype);

util.addMembersToPrototype(ErrorObject.prototype, {
	id: {},
	links: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof LinksObject))
				return new LinksObject(value);
			return value;
		},
		validate: function(value, key, options) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!(value instanceof LinksObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (LinksObject)', key);

			util.validateMemberValue(key, value, options)
		}
	},
	status: {
		validate: function(value, key) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key);
		}
	},
	code: {
		validate: function(value, key) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key);
		}
	},
	title: {},
	detail: {},
	source: {
		validate: function(value, key) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!util.isObject(value))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			if (util.hasOwnProperty(value, 'pointer') && typeof value.pointer !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', 'pointer', [key]);

			if (util.hasOwnProperty(value, 'parameter') && typeof value.parameter !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', 'parameter', [key]);

			// TODO: Validate pointer as a JSON Pointer [RFC6901]?
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

			util.validateMemberValue(key, value, options);
		}
	}
});
