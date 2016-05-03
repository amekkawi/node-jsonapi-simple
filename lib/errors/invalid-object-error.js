"use strict";

module.exports = InvalidObjectError;

function InvalidObjectError(objectName, message, pointer) {
	this.message = 'Invalid ' + objectName + ': ' + message;
	this.objectName = objectName;
	this.pointer = pointer || '';
	this.name = 'InvalidObjectError';
	Error.captureStackTrace(this, InvalidObjectError);
}
InvalidObjectError.prototype = Object.create(Error.prototype);
InvalidObjectError.prototype.constructor = InvalidObjectError;
