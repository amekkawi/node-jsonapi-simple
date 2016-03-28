"use strict";

module.exports = InvalidMemberValueError;

function InvalidMemberValueError(objectName, message, member, memberPath) {
	this.message = 'Invalid ' + objectName + ' member value for ' + member + ': ' + message;
	this.objectName = objectName;
	this.member = member;
	this.memberPath = memberPath || [];
	this.name = 'InvalidMemberValueError';
	Error.captureStackTrace(this, InvalidMemberValueError);
}
InvalidMemberValueError.prototype = Object.create(Error.prototype);
InvalidMemberValueError.prototype.constructor = InvalidMemberValueError;
