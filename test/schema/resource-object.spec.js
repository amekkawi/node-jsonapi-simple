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

	it('is invalid if it has no members', function() {
		expect(function() {
			new ResourceObject({}).validate();
		}).toThrow(InvalidMemberValueError);
	});

	it('is invalid if "type" member is missing or NOT a string', function() {
		expect(tryReturn(function() {
			new ResourceObject({
				id: 'foo'
			}).validate();
		}))
			.toBeA(InvalidMemberValueError)
			.toInclude({
				objectName: 'ResourceObject',
				member: 'type',
				memberPath: []
			});
	});

	it('is invalid if "id" member is missing or NOT a string', function() {
		expect(tryReturn(function() {
			new ResourceObject({
				type: 'foo'
			}).validate();
		}))
			.toBeA(InvalidMemberValueError)
			.toInclude({
				objectName: 'ResourceObject',
				member: 'id',
				memberPath: []
			});
	});

	it('is valid if missing a "id" member and "documentType" validation option is "document"', function() {
		expect(function() {
			new ResourceObject({
				type: 'foo'
			}).validate({documentType: 'request'});
		}).toNotThrow(null);
	});

	var objInstance = new ResourceObject({
		id: 'foo',
		type: 'bar'
	});
	expect(objInstance.validate())
		.toBe(objInstance, 'validate returns "this"');

	// Required to be objects
	['attributes', 'relationships', 'links', 'meta'].forEach(function(member) {
		it('is invalid if "' + member + '" is a member and is NOT an object', function() {
			[[], 500, null].forEach(function(value) {
				var obj = {
					type: 'foo',
					id: 'bar'
				};
				obj[member] = value;

				expect(tryReturn(function() {
					new ResourceObject(obj).validate();
				}))
					.toBeA(InvalidMemberValueError)
					.toInclude({
						objectName: 'ResourceObject',
						member: member,
						memberPath: []
					});
			});
		});
	});
});
