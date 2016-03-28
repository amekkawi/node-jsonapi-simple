"use strict";

var expect = require('expect');
var ResourceObject = require('../../lib/schema/resource-object');
var InvalidMemberError = require('../../lib/errors/invalid-member-error');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

function tryReturn(fn) {
	try {
		return fn();
	}
	catch (err) {
		return err;
	}
}

describe('Resource Object', function() {
	it('should have expected prototype methods', function() {
		expect(ResourceObject.prototype.set).toBeA('function');
		expect(ResourceObject.prototype.setId).toBeA('function');
		expect(ResourceObject.prototype.setType).toBeA('function');
		expect(ResourceObject.prototype.setAttributes).toBeA('function');
		expect(ResourceObject.prototype.setRelationships).toBeA('function');
		expect(ResourceObject.prototype.setLinks).toBeA('function');
		expect(ResourceObject.prototype.setMeta).toBeA('function');
		expect(ResourceObject.prototype.validate).toBeA('function');
		expect(ResourceObject.prototype.toJSON).toBeA('function');
	});

	// TODO: Test that set* methods work as expected

	it('should set and validate to spec', function() {
		// See: http://jsonapi.org/format/#document-resource-objects

		expect(function() {
			new ResourceObject({}).validate();
		}).toThrow(InvalidMemberValueError, 'MUST NOT be an empty object');

		expect(tryReturn(function() {
			new ResourceObject({
				id: 'foo'
			}).validate();
		}))
			.toBeA(InvalidMemberValueError, 'MUST have a string "type" member')
			.toInclude({
				objectName: 'ResourceObject',
				member: 'type',
				memberPath: []
			});

		expect(tryReturn(function() {
			new ResourceObject({
				type: 'foo'
			}).validate();
		}))
			.toBeA(InvalidMemberValueError, 'MUST have a string "id" member')
			.toInclude({
				objectName: 'ResourceObject',
				member: 'id',
				memberPath: []
			});

		expect(function() {
			new ResourceObject({
				type: 'foo'
			}).validate({ documentType: 'request' });
		}).toNotThrow(null, 'MAY NOT have a string "id" member if request document');

		var objInstance = new ResourceObject({
			id: 'foo',
			type: 'bar'
		});
		expect(objInstance.validate())
			.toBe(objInstance, 'validate returns "this"');

	});
});
