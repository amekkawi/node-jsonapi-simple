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

BaseObject.prototype.validate = function(options) {
	return this;
};

BaseObject.prototype.toJSON = function() {
	return this.props;
};
