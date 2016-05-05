"use strict";

var expect = require('expect');
var MetaObject = require('../../lib/schema/meta-object');

describe('Meta Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(MetaObject.prototype[member]).toBeA('function');
			});
	});

	it('should allow no arguments constructor', function() {
		new MetaObject();
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
