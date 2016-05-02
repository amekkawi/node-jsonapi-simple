"use strict";

var expect = require('expect');
var MetaObject = require('../../lib/schema/meta-object');

describe('Meta Object', function() {
	it('should have expected prototype methods', function() {
		expect(MetaObject.prototype.set).toBeA('function');
		expect(MetaObject.prototype.validate).toBeA('function');
		expect(MetaObject.prototype.toJSON).toBeA('function');
	});

	// TODO: Test that set works as expected

	it('is valid with no members', function() {
		expect(function() {
			new MetaObject({}).validate('');
		}).toBeValid();
	});

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

	it('allows any member to be set', function() {
		expect(
			new MetaObject(exampleObj()).toJSON()
		).toEqual(exampleObj());
	});

	it('is valid with any member name', function() {
		expect(function() {
			new MetaObject(exampleObj()).validate('');
		}).toBeValid();
	});

	it('validate method should return "this"', function() {
		var objInstance = new MetaObject({});
		expect(objInstance.validate(''))
			.toBe(objInstance);
	});
});
