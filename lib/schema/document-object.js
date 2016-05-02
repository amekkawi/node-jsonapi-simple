"use strict";

var util = require('./../util');
var Pointer = require('../util/json-pointer');
var ResourceObject = require('./resource-object');
var BaseObject = require('./base-object');
var BaseMembersObject = require('./base-members-object');
var MetaObject = require('./meta-object');
var ErrorObject = require('./error-object');
var LinksObject = require('./links-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');
var InvalidObjectError = require('../errors/invalid-object-error');
var hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = DocumentObject;

function DocumentObject(obj) {
	BaseMembersObject.call(this, obj);
}

util.inherits(DocumentObject, BaseMembersObject);

DocumentObject.prototype.validate = function(pointer, options) {
	var props = this.props;
	if (!(props.data || hasOwnProperty.call(props, 'data'))
		&& !(props.errors || hasOwnProperty.call(props, 'errors'))
		&& !(props.meta || hasOwnProperty.call(props, 'meta'))) {
		throw new InvalidObjectError(util.getProtoName(this), 'must contain at least one of the following members: data, errors, meta');
	}

	BaseMembersObject.prototype.validate.call(this, pointer, options);

	return this;
};

util.addMembersToPrototype(DocumentObject.prototype, {
	data: {
		push: true,
		toJSON: function(value) {
			if (!value)
				return value;

			// TODO: Why check for null/undefined?
			if (value != null) {
				if (util.isArray(value))
					return value.map(function(value) {
						return value.toJSON();
					});
			}

			return value.toJSON();
		},
		parse: function(value) {
			if (util.isArray(value)) {
				value = value.map(function(val) {
					return !util.isObject(val) || val instanceof BaseObject
						? val
						: new ResourceObject(val);
				});
			}
			else if (util.isObject(value) && !(value instanceof BaseObject)) {
				value = new ResourceObject(value);
			}

			return value;
		},
		validate: function(value, key, parentPointer, options) {
			if (value === null || typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			var memberPointer = Pointer.addToken(parentPointer, key);

			if (util.isArray(value)) {
				for (var i = 0, l = value.length; i < l; i++) {
					if (!(value[i] instanceof ResourceObject))
						throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (ResourceObject)', i, memberPointer);

					util.validateMemberValue(Pointer.addToken(memberPointer, i), value[i], options);
				}
			}
			else {
				if (!(value instanceof ResourceObject))
					throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (ResourceObject)', key, parentPointer);

				util.validateMemberValue(memberPointer, value, options);
			}
		}
	},
	included: {
		push: true,
		parse: function(value) {
			if (util.isArray(value)) {
				value = value.map(function(val) {
					return !util.isObject(val) || val instanceof BaseObject
						? val
						: new ResourceObject(val);
				});
			}
			else if (util.isObject(value) && !(value instanceof BaseObject)) {
				value = new ResourceObject(value);
			}

			return value;
		},
		validate: function(value, key, parentPointer, options) {
			var props = this.props;
			if (typeof value === 'undefined' && !hasOwnProperty.call(props, key))
				return;

			if (typeof props.data === 'undefined' || !hasOwnProperty.call(props, 'data'))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must not have "' + key + '" member if does not also have "data" member', key, parentPointer);

			if (!util.isArray(value))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an array', key, parentPointer);

			var memberPointer = Pointer.addToken(parentPointer, key);

			for (var i = 0, l = value.length; i < l; i++) {
				if (!(value[i] instanceof ResourceObject))
					throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (ResourceObject)', i, memberPointer);

				util.validateMemberValue(Pointer.addToken(memberPointer, i), value[i], options);
			}
		},
		toJSON: function(value) {
			if (!util.isArray(value))
				return value;

			return value.map(function(value) {
				return value.toJSON();
			});
		}
	},
	errors: {
		push: true,
		toJSON: function(value) {
			if (!util.isArray(value))
				return value;

			return value.map(function(value) {
				return value.toJSON();
			});
		},
		parse: function(value) {
			if (util.isArray(value)) {
				value = value.map(function(val) {
					return !util.isObject(val) || val instanceof BaseObject
						? val
						: new ErrorObject(val);
				});
			}
			else if (util.isObject(value) && !(value instanceof BaseObject)) {
				value = new ErrorObject(value);
			}

			return value;
		},
		validate: function(value, key, parentPointer, options) {
			if (typeof value === 'undefined' && !hasOwnProperty.call(this.props, key))
				return;

			if (hasOwnProperty.call(this.props, 'data'))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must not have "' + key + '" member if also has "data" member', key, parentPointer);

			if (!util.isArray(value))
				throw new InvalidMemberValueError(util.getProtoName(this), 'must be an array', key, parentPointer);

			var memberPointer = Pointer.addToken(parentPointer, key);

			for (var i = 0, l = value.length; i < l; i++) {
				if (!(value[i] instanceof ErrorObject))
					throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object (ErrorObject)', i, memberPointer);

				util.validateMemberValue(Pointer.addToken(memberPointer, i), value[i], options);
			}
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

			util.validateMemberValue(Pointer.addToken(parentPointer, key), value, options);
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
	},
	jsonapi: {
		// TODO
	}
});
