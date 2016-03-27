"use strict";

module.exports = InvalidMemberError;

function InvalidMemberError(member, memberPath) {
	this.message = 'Invalid ErrorObject member: ' + member;
	this.member = member;
	this.memberPath = memberPath || [member];
	this.name = 'InvalidMemberError';
	Error.captureStackTrace(this, InvalidMemberError);
}
InvalidMemberError.prototype = Object.create(Error.prototype);
InvalidMemberError.prototype.constructor = InvalidMemberError;
