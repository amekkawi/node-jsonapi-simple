"use strict";

module.exports = InvalidObjectError;

function InvalidObjectError(objectName, message, memberPath) {
	this.message = 'Invalid ' + objectName + ': ' + message;
	this.objectName = objectName;
	this.memberPath = memberPath || [];
	this.name = 'InvalidObjectError';
	Error.captureStackTrace(this, InvalidObjectError);
}
InvalidObjectError.prototype = Object.create(Error.prototype);
InvalidObjectError.prototype.constructor = InvalidObjectError;
