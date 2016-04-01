"use strict";

var expect = require('expect');
var AttributesObject = require('../../lib/schema/attributes-object');
var InvalidMemberError = require('../../lib/errors/invalid-member-error');

function tryReturn(fn) {
	try {
		return fn();
	}
	catch (err) {
		return err;
	}
}

describe('Attributes Object', function() {
	it('should have expected prototype methods', function() {
		expect(AttributesObject.prototype.set).toBeA('function');
		expect(AttributesObject.prototype.validate).toBeA('function');
		expect(AttributesObject.prototype.toJSON).toBeA('function');
	});

	// TODO: Test that set works as expected

	it('is valid with no members', function() {
		expect(function() {
			new AttributesObject({}).validate();
		}).toNotThrow();
	});

	it('validate method should return "this"', function() {
		var objInstance = new AttributesObject({});
		expect(objInstance.validate())
			.toBe(objInstance);
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
			new AttributesObject(exampleObj()).toJSON()
		).toEqual(exampleObj());
	});

	it('is valid with any member name', function() {
		expect(function() {
			new AttributesObject(exampleObj()).validate();
		}).toNotThrow();
	});

	['relationships', 'links'].forEach(function(member) {
		var shallow = {};
		shallow[member] = [];

		var deep = {foo: {}};
		deep.foo[member] = [];

		it('is invalid if has a "' + member + '" member', function() {
			expect(tryReturn(function() {
				new AttributesObject(shallow)
					.validate();
			}))
				.toBeA(InvalidMemberError)
				.toInclude({
					objectName: 'AttributesObject',
					member: member,
					memberPath: []
				});
		});

		it('is invalid if has a nested "' + member + '" member', function() {
			expect(tryReturn(function() {
				new AttributesObject(deep)
					.validate();
			}))
				.toBeA(InvalidMemberError)
				.toInclude({
					objectName: 'AttributesObject',
					member: member,
					memberPath: ['foo']
				});
		});

		it('is valid with a "' + member + '" member if validation option "allowAnyAttributeName" is true', function() {
			expect(function() {
				new AttributesObject(shallow)
					.validate({allowAnyAttributeName: true});
			})
				.toNotThrow();
		});

		it('is valid with a nested "' + member + '" member if validation option "allowAnyAttributeName" is true', function() {
			expect(function() {
				new AttributesObject(deep)
					.validate({allowAnyAttributeName: true});
			})
				.toNotThrow();
		});
	});
});
