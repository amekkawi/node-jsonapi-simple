"use strict";

var expect = require('expect');
var MetaObject = require('../../lib/schema/meta-object');
var InvalidMemberError = require('../../lib/errors/invalid-member-error');

function tryReturn(fn) {
	try {
		return fn();
	}
	catch (err) {
		return err;
	}
}

describe('Meta Object', function() {
	it('should have expected prototype methods', function() {
		expect(MetaObject.prototype.set).toBeA('function');
		expect(MetaObject.prototype.validate).toBeA('function');
		expect(MetaObject.prototype.toJSON).toBeA('function');
	});

	// TODO: Test that set works as expected

	it('should set and validate to spec', function() {
		// See: http://jsonapi.org/format/#document-meta

		expect(function() {
			new MetaObject({}).validate();
		}).toNotThrow(null, 'MAY be an empty object');

		var objInstance = new MetaObject({});
		expect(objInstance.validate())
			.toBe(objInstance, 'validate returns "this"');

		function exampleObj() {
			return {
				'true': true,
				'false': true,
				'str': 'string',
				'num': 5,
				'arr': [],
				'obj': {
					child1: 5
				}
			};
		}

		expect(
			new MetaObject(exampleObj()).toJSON()
		).toEqual(exampleObj(), 'sets any member');

		expect(function() {
			new MetaObject(exampleObj()).validate();
		}).toNotThrow(null, 'validates with any member name');
	});
});
