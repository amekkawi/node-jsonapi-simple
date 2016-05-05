"use strict";

var expect = require('expect');
var ResourceObject = require('../../lib/schema/resource-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

describe('Resource Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(ResourceObject.prototype[member]).toBeA('function');
			});
	});

	it('should allow no arguments constructor', function() {
		new ResourceObject();
	});

	it('should set members through constructor, "set" method, and named setter methods', function() {
		expect(ResourceObject)
			.toSetMembers(['id', 'type', 'attributes', 'relationships', 'links', 'meta']);
	});

	it('is invalid if it has no members', function() {
		expect(function() {
			new ResourceObject({}).validate('');
		}).toThrow(InvalidMemberValueError);
	});

	it('is invalid if "type" member is missing or NOT a string', function() {
		expect(function() {
			new ResourceObject({
				id: 'foo'
			}).validate('');
		})
			.toBeInvalid(InvalidMemberValueError, {
				objectName: 'ResourceObject',
				member: 'type',
				pointer: '/type'
			});
	});

	it('is invalid if "id" member is missing or NOT a string', function() {
		expect(function() {
			new ResourceObject({
				type: 'foo'
			}).validate('');
		})
			.toBeInvalid(InvalidMemberValueError, {
				objectName: 'ResourceObject',
				member: 'id',
				pointer: '/id'
			});
	});

	it('is valid if missing a "id" member and "documentType" validation option is "document"', function() {
		expect(function() {
			new ResourceObject({
				type: 'foo'
			}).validate('', {documentType: 'request'});
		}).toBeValid();
	});

	// Required to be objects
	['attributes', 'relationships', 'links', 'meta'].forEach(function(member) {
		it('is invalid if "' + member + '" is a member and is NOT an object', function() {
			[void 0, [], 500, null].forEach(function(value) {
				var obj = {
					type: 'foo',
					id: 'bar'
				};
				obj[member] = value;

				expect(function() {
					new ResourceObject(obj).validate('');
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'ResourceObject',
						member: member,
						pointer: '/' + member
					}, value);
			});
		});
	});

	it('validate method should return "this"', function() {
		var objInstance = new ResourceObject({
			id: 'foo',
			type: 'bar'
		});
		expect(objInstance.validate(''))
			.toBe(objInstance);
	});
});
