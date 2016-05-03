"use strict";

var pointerUtil = require('../util/json-pointer');

module.exports = InvalidMemberError;

function InvalidMemberError(objectName, member, parentPointer) {
	this.message = 'Invalid ' + objectName + ' member: ' + member;
	this.objectName = objectName;
	this.member = member;
	this.pointer = pointerUtil.addToken(parentPointer || '', member);
	this.name = 'InvalidMemberError';
	Error.captureStackTrace(this, InvalidMemberError);
}
InvalidMemberError.prototype = Object.create(Error.prototype);
InvalidMemberError.prototype.constructor = InvalidMemberError;
