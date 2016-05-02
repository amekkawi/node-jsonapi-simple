"use strict";

var util = require('./util');
var ErrorObject = require('./schema/error-object');
var ResourceObject = require('./schema/resource-object');

module.exports = JsonApiDocument;

function JsonApiDocument() {
	var _private = this._getDefaults();

	// Bind methods to _private
	this._bindPrivate(_private);

	// Define getters/setters for props
	this._defineProps(_private);

	// Freeze object in development to catch setting invalid members
	// TODO: Re-enable this?
	//if (process.env.NODE_ENV !== 'production')
	//	Object.freeze(this);
}

JsonApiDocument.prototype._getDefaults = function() {
	return {
		__self: this,
		data: void 0,
		errors: void 0,
		meta: void 0
	};
};

JsonApiDocument.prototype._bindPrivate = function(_private) {
	util.bindMethods(this, protoKeys_JsonApiDocument, JsonApiDocument.prototype, _private);
};

JsonApiDocument.prototype._defineProps = function(_private) {
	var props = {
		data: {
			get: util.jsonMixedGetter.bind(_private, 'data'),
			set: this.setData
		},
		errors: {
			get: util.jsonArrayGetter.bind(_private, 'errors'),
			set: this.setErrors
		},
		meta: {
			get: util.jsonValueGetter.bind(_private, 'meta'),
			set: this.setMeta
		}
	};

	for (var key in props) {
		// Define property, if it has not already been set (i.e. by libraries extending this one)
		if (!Object.getOwnPropertyDescriptor(this, key))
			util.defineProp(this, key, props[key].get, props[key].set);
	}
};

JsonApiDocument.prototype.setData = function(resourceObject) {
	if (typeof this.errors !== 'undefined')
		throw new Error('Cannot add "data" if "errors" member is set');

	if (Array.isArray(resourceObject)) {
		this.data = void 0;
		resourceObject.forEach(this.__self.addData);
	}
	else {
		if (!(resourceObject instanceof ResourceObject))
			resourceObject = new ResourceObject(resourceObject);
		this.data = resourceObject;
	}
	return this.__self;
};

JsonApiDocument.prototype.addData = function(resourceObject) {
	if (typeof this.errors !== 'undefined')
		throw new Error('Cannot add "data" if "errors" member is set');

	var data = this.data || (this.data = []);

	if (!Array.isArray(resourceObject))
		resourceObject = [resourceObject];

	resourceObject.forEach(function(obj) {
		if (!(obj instanceof ResourceObject))
			obj = new ResourceObject(obj);

		data.push(obj);
	});

	return this.__self;
};

JsonApiDocument.prototype.setErrors = function(errorObjects) {
	this.errors = [];
	errorObjects.forEach(this.__self.addError);
	return this.__self;
};

JsonApiDocument.prototype.addError = function(errorObject) {
	if (typeof this.data !== 'undefined')
		throw new Error('Cannot add error if "data" member is set');

	if (!(error instanceof ErrorObject))
		error = new ErrorObject(error);

	if (!this.errors)
		this.errors = [];

	this.errors.push(error);
	return this.__self;
};

JsonApiDocument.prototype.setMeta = function(meta) {
	return this.__self;
};

var protoKeys_JsonApiDocument = Object.keys(JsonApiDocument.prototype);
