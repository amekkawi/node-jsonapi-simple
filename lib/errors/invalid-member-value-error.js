"use strict";

var pointerUtil = require('../util/json-pointer');

module.exports = InvalidMemberValueError;

function InvalidMemberValueError(objectName, message, member, parentPointer) {
	this.message = 'Invalid ' + objectName + ' member value for ' + member + ': ' + message;
	this.objectName = objectName;
	this.member = member;
	this.pointer = pointerUtil.addToken(parentPointer || '', member);
	this.name = 'InvalidMemberValueError';
	Error.captureStackTrace(this, InvalidMemberValueError);
}
InvalidMemberValueError.prototype = Object.create(Error.prototype);
InvalidMemberValueError.prototype.constructor = InvalidMemberValueError;
