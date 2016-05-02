"use strict";

var util = require('../util');

module.exports = BaseObject;

function BaseObject(obj) {
	this.props = {};
	if (obj)
		this.set(obj);
}

BaseObject.prototype.set = function(key, value) {
	throw new Error('Must implement set method');
};

BaseObject.prototype.validate = function(pointer, options) {
	if (typeof pointer !== 'string')
		throw new Error('JSON pointer must be a string');
	return this;
};

BaseObject.prototype.toJSON = function() {
	return this.props;
};
