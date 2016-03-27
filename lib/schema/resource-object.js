"use strict";

var util = require('./../util');
var BaseObject = require('./base-object');
var AttributesObject = require('./attributes-object');

module.exports = ResourceObject;

function ResourceObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(ResourceObject, BaseObject.prototype);

ResourceObject.prototype.toJSON = function() {
	// TODO: Call toJSON on props as needed
	return this.props;
};

BaseObject.addMembersToPrototype(ResourceObject.prototype, {
	id: {},
	type: {},
	attributes: {
		parse: function(value) {
			if (value && value === 'object' && !(value instanceof AttributesObject))
				return new AttributesObject(value);

			return value;
		}
	},
	relationships: {},
	links: {},
	meta: {}
});
