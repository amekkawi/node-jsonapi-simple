"use strict";

var util = require('./../util');
var MetaObject = require('./meta-object');
var RelationshipObject = require('./relationship-object');
var InvalidMemberValueError = require('../errors/invalid-member-value-error');

module.exports = RelationshipsObject;

function RelationshipsObject(obj) {
	MetaObject.call(this, obj);
}

util.superClass(RelationshipsObject, MetaObject.prototype);

RelationshipsObject.prototype.parse = function(key, value) {
	if (util.isObject(value) && !(value instanceof RelationshipObject))
		return new RelationshipObject(value);
	return value;
};

RelationshipsObject.prototype.validate = function(options) {
	MetaObject.prototype.validate.call(this, options);

	var keys = Object.keys(this.props);
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		var value = this.props[keys[i]];

		if (!value || !(value instanceof RelationshipObject))
			throw new InvalidMemberValueError(util.getProtoName(this), 'must be an object', key);

		util.validateMemberValue(key, value, options);
	}

	// TODO: Validate that member names (including type and id) are unique accross attributes and relationships
	// http://jsonapi.org/format/#document-resource-object-fields

	return this;
};

RelationshipsObject.prototype.toJSON = function() {
	var propKeys = util.objectKeys(this.props);
	var ret = {};
	for (var i = 0, l = propKeys.length; i < l; i++) {
		var key = propKeys[i];
		var value = this.props[key];
		ret[key] = value && value.toJSON();
	}
	return ret;
};
