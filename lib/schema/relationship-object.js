"use strict";

var util = require('./../util');
var Pointer = require('../util/json-pointer');
var BaseObject = require('./base-object');
var BaseMembersObject = require('./base-members-object');
var MetaObject = require('./meta-object');
var LinksObject = require('./links-object');
var ResourceIdentifierObject = require('./resource-identifier-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');
var InvalidObjectError = require('../errors/invalid-object-error');

module.exports = RelationshipObject;

function RelationshipObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.inherits(RelationshipObject, BaseMembersObject);

RelationshipObject.prototype.validate = function(pointer, options) {
	BaseMembersObject.prototype.validate.call(this, pointer, options);

	if (!(this.props.links || util.hasOwnProperty(this.props, 'links'))
		&& !(this.props.data || util.hasOwnProperty(this.props, 'data'))
		&& !(this.props.meta || util.hasOwnProperty(this.props, 'meta'))) {
		throw new InvalidObjectError(util.getProtoName(this), 'must contain at least one of the following members: links, data, meta');
	}

	return this;
};

util.addMembersToPrototype(RelationshipObject.prototype, {
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

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options);

			// TODO: MUST contain one of the following: self, related
		}
	},
	data: {
		toJSON: function(value) {
			if (!value)
				return value;

			if (value != null) {
				if (util.isArray(value))
					return value.map(function(value) {
						return value.toJSON();
					});
			}

			return value.toJSON();
		},
		parse: function(value) {
			if (value != null) {
				if (util.isArray(value)) {
					return value.map(function(value) {
						if (util.isObject(value) && !(value instanceof BaseObject))
							return new ResourceIdentifierObject(value);
						return value;
					});
				}
				else if (util.isObject(value) && !(value instanceof BaseObject)) {
					return new ResourceIdentifierObject(value);
				}
			}

			return value;
		},
		validate: function(value, key, parentPointer, options) {
			// Can be null
			if (value === null || typeof value === 'undefined' && !util.hasOwnProperty(this.props, key))
				return;

			var memberPointer = Pointer.addToken(parentPointer, key);

			if (util.isArray(value)) {
				for (var i = 0, l = value.length; i < l; i++) {
					if (!(value[i] instanceof ResourceIdentifierObject))
						throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (ResourceIdentifierObject)', i, memberPointer);

					util.validateMemberValue(Pointer.addToken(memberPointer, i), value[i], options);
				}
			}
			else {
				if (!(value instanceof ResourceIdentifierObject))
					throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (ResourceIdentifierObject)', key, parentPointer);

				util.validateMemberValue(memberPointer, value, options);
			}
		}
	},
	meta: {
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

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options)
		}
	}
});
