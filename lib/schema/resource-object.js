"use strict";

var util = require('./../util');
var BaseObject = require('./base-object');
var BaseMembersObject = require('./base-members-object');
var MetaObject = require('./meta-object');
var AttributesObject = require('./attributes-object');
var RelationshipsObject = require('./relationships-object');
var LinksObject = require('./links-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = ResourceObject;

function ResourceObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.inherits(ResourceObject, BaseMembersObject);

util.addMembersToPrototype(ResourceObject.prototype, {
	id: {
		validate: function(value, key, options) {
			if (options.documentType === 'request' && typeof value === 'undefined')
				return;

			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key);
		}
	},
	type: {
		validate: function(value, key) {
			if (typeof value !== 'string')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be a string', key);
		}
	},
	attributes: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !util.isArray(value) && !(value instanceof BaseObject))
				return new AttributesObject(value);
			return value;
		},
		validate: function(value, key, options) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!(value instanceof AttributesObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (AttributesObject)', key);

			util.validateMemberValue(key, value, options)
		}
	},
	relationships: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof BaseObject))
				return new RelationshipsObject(value);
			return value;
		},
		validate: function(value, key, options) {
			if (typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			if (!(value instanceof RelationshipsObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (RelationshipsObject)', key);

			util.validateMemberValue(key, value, options)
		}
	},
	links: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof BaseObject))
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
	meta: {
		toJSON: true,
		parse: function(value) {
			if (util.isObject(value) && !(value instanceof BaseObject))
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
