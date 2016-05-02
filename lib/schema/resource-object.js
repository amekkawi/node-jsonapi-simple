"use strict";

var util = require('./../util');
var Pointer = require('../util/json-pointer');
var BaseObject = require('./base-object');
var BaseMembersObject = require('./base-members-object');
var MetaObject = require('./meta-object');
var AttributesObject = require('./attributes-object');
var RelationshipsObject = require('./relationships-object');
var LinksObject = require('./links-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');
var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = ResourceObject;

function ResourceObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.inherits(ResourceObject, BaseMembersObject);

util.addMembersToPrototype(ResourceObject.prototype, {
	id: {
		validate: function(value, key, parentPointer, options) {
			if (options.documentType === 'request' && typeof value === 'undefined')
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	type: {
		validate: function(value, key, parentPointer) {
			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key, parentPointer);
		}
	},
	attributes: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !Array.isArray(value) && !(value instanceof BaseObject))
				return new AttributesObject(value);
			return value;
		},
		validate: function(value, key, parentPointer, options) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (!(value instanceof AttributesObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (AttributesObject)', key, parentPointer);

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options)
		}
	},
	relationships: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof BaseObject))
				return new RelationshipsObject(value);
			return value;
		},
		validate: function(value, key, parentPointer, options) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (!(value instanceof RelationshipsObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (RelationshipsObject)', key, parentPointer);

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options)
		}
	},
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

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options)
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

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options);
		}
	}
});
