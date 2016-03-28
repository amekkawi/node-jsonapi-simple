"use strict";

var util = require('./../util');
var BaseObject = require('./base-object');
var MetaObject = require('./meta-object');
var LinksObject = require('./links-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = RelationshipsObject;

function RelationshipsObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(RelationshipsObject, BaseObject.prototype);

RelationshipsObject.prototype.validate = function(options) {
	BaseObject.prototype.validate.call(this, options);

	// TODO: MUST contain at least one of the following: links, data, meta
	return this;
};

RelationshipsObject.prototype.toJSON = function() {
	// TODO: Call toJSON on props as needed
	return this.props;
};

BaseObject.addMembersToPrototype(RelationshipsObject.prototype, {
	links: {
		parse: function(value) {
			if (value && typeof value === 'object' && !(value instanceof LinksObject))
				return new LinksObject(value);
			return value;
		},
		validate: function(value, key, options) {
			if (typeof this.props[key] === 'undefined')
				return;

			if (!(value instanceof LinksObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			util.validateMemberValue(key, value, options)
		}
	},
	data: {
		// TODO: Add parse
		validate: function(value, key) {
			if (typeof this.props[key] === 'undefined')
				return;

			if (typeof value !== 'object')
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			// TODO: Enable validation
			//util.validateMemberValue(key, value, options)
		}
	},
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

			util.validateMemberValue(key, value, options)
		}
	}
});
