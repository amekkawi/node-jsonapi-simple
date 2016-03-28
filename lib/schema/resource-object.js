"use strict";

var util = require('./../util');
var BaseObject = require('./base-object');
var MetaObject = require('./meta-object');
var AttributesObject = require('./attributes-object');
var RelationshipsObject = require('./relationships-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = ResourceObject;

function ResourceObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(ResourceObject, BaseObject.prototype);

ResourceObject.prototype.toJSON = function() {
	// TODO: Call toJSON on props as needed
	return this.props;
};

util.addMembersToPrototype(ResourceObject.prototype, {
	id: {
		validate: function(value, key, options) {
			if (options.documentType === 'request' && typeof this.props[key] === 'undefined')
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
		parse: function(value) {
			if (value && typeof value === 'object' && !(value instanceof AttributesObject))
				return new AttributesObject(value);
			return value;
		},
		validate: function(value, key, options) {
			if (typeof this.props[key] === 'undefined')
				return;

			if (!(value instanceof AttributesObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			util.validateMemberValue(key, value, options)
		}
	},
	relationships: {
		parse: function(value) {
			if (value && typeof value === 'object' && !(value instanceof RelationshipsObject))
				return new RelationshipsObject(value);
			return value;
		}
	},
	links: {},
	meta: {
		parse: function(value) {
			if (value && typeof value === 'object' && !(value instanceof MetaObject))
				return new MetaObject(value);
			return value;
		},
		validate: function(value, key) {
			if (typeof this.props[key] === 'undefined')
				return;

			if (!(value instanceof MetaObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			util.validateMemberValue(key, value, options);
		}
	}
});
