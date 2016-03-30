"use strict";

var util = require('./../util');
var BaseObject = require('./base-object');
var MetaObject = require('./meta-object');
var LinksObject = require('./links-object');
var ResourceIdentifierObject = require('./resource-identifier-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = RelationshipObject;

function RelationshipObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(RelationshipObject, BaseObject.prototype);

RelationshipObject.prototype.validate = function(options) {
	BaseObject.prototype.validate.call(this, options);

	// TODO: MUST contain at least one of the following: links, data, meta
	return this;
};

util.addMembersToPrototype(RelationshipObject.prototype, {
	links: {
		toJSON: true,
		parse: function(value) {
			if (value && typeof value === 'object' && !(value instanceof LinksObject))
				return new LinksObject(value);
			return value;
		},
		validate: function(value, key, options) {
			if (typeof value === 'undefined')
				return;

			if (!(value instanceof LinksObject))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

			util.validateMemberValue(key, value, options);

			// TODO: MUST contain one of the following: self, related
		}
	},
	data: {
		toJSON: function(value) {
			if (!value)
				return value;

			if (util.isArray(value))
				return value.map(function(value) {
					return value.toJSON();
				});

			return value.toJSON();
		},
		parse: function(value) {
			if (value == null)
				return value;

			if (value) {
				if (util.isArray(value)) {
					return value.map(function(value) {
						if (value && typeof value === 'object' && !(value instanceof ResourceIdentifierObject))
							return new ResourceIdentifierObject(value);
						return value;
					});
				}
				else if (typeof value === 'object' && !(value instanceof ResourceIdentifierObject)) {
					return new ResourceIdentifierObject(value);
				}
			}

			return value;
		},
		validate: function(value, key) {
			if (value == null)
				return;

			if (util.isArray(value)) {
				for (var i = 0, l = value.length; i < l; i++) {
					if (!(value[i] instanceof ResourceIdentifierObject))
						throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', i, [key]);

					util.validateMemberValue([key, i], value[i], options);
				}
			}
			else {
				if (!(value instanceof ResourceIdentifierObject))
					throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

				util.validateMemberValue(key, value, options);
			}
		}
	},
	meta: {
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
