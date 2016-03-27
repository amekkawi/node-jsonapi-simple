"use strict";

var util = require('../util');
var BaseObject = require('./base-object');

function ErrorObject(obj) {
	BaseObject.call(this, obj);
}

util.superClass(ErrorObject, BaseObject.prototype);

ErrorObject.prototype.toJSON = function() {
	// TODO: Call toJSON on props as needed
	return this.props;
};

BaseObject.addMembersToPrototype(ErrorObject.prototype, {
	id: {},
	links: {},
	status: {},
	code: {},
	title: {},
	detail: {},
	source: {},
	meta: {}
});
