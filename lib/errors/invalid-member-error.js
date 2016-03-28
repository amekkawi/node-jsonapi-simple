"use strict";

module.exports = InvalidMemberError;

function InvalidMemberError(objectName, member, memberPath) {
	this.message = 'Invalid ' + objectName + ' member: ' + member;
	this.objectName = objectName;
	this.member = member;
	this.memberPath = memberPath || [];
	this.name = 'InvalidMemberError';
	Error.captureStackTrace(this, InvalidMemberError);
}
InvalidMemberError.prototype = Object.create(Error.prototype);
InvalidMemberError.prototype.constructor = InvalidMemberError;
