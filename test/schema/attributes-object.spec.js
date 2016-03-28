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

	it('should set and validate to spec', function() {
		// See: http://jsonapi.org/format/#document-resource-object-attributes

		expect(function() {
			new AttributesObject({}).validate();
		}).toNotThrow(null, 'MAY be an empty object');

		var objInstance = new AttributesObject({});
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
			new AttributesObject(exampleObj()).toJSON()
		).toEqual(exampleObj(), 'sets any member');

		expect(function() {
			new AttributesObject(exampleObj()).validate();
		}).toNotThrow(null, 'validates with any member name');

		expect(tryReturn(function() {
			new AttributesObject({
				relationships: []
			}).validate();
		}))
			.toBeA(InvalidMemberError, 'MUST NOT contain a "relationships" member')
			.toInclude({
				objectName: 'AttributesObject',
				member: 'relationships',
				memberPath: []
			});

		expect(tryReturn(function() {
			new AttributesObject({
				foo: {
					relationships: []
				}
			}).validate();
		}))
			.toBeA(InvalidMemberError, 'MUST NOT contain a deep "relationships" member')
			.toInclude({
				objectName: 'AttributesObject',
				member: 'relationships',
				memberPath: ['foo']
			});

		expect(tryReturn(function() {
			new AttributesObject({
				links: []
			}).validate();
		}))
			.toBeA(InvalidMemberError, 'MUST NOT contain a "links" member')
			.toInclude({
				objectName: 'AttributesObject',
				member: 'links',
				memberPath: []
			});

		expect(tryReturn(function() {
			new AttributesObject({
				foo: {
					links: []
				}
			}).validate();
		}))
			.toBeA(InvalidMemberError, 'MUST NOT contain a deep "links" member')
			.toInclude({
				objectName: 'AttributesObject',
				member: 'links',
				memberPath: ['foo']
			});
	});
});
