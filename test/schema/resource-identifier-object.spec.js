"use strict";

var expect = require('expect');
var ResourceIdentifierObject = require('../../lib/schema/resource-identifier-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

describe('Resource Identifier Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(ResourceIdentifierObject.prototype[member]).toBeA('function');
			});
	});

	it('should allow no arguments constructor', function() {
		new ResourceIdentifierObject();
	});

	it('should set members through constructor, "set" method, and named setter methods', function() {
		expect(ResourceIdentifierObject)
			.toSetMembers(['type', 'id', 'meta']);
	});

	it('is invalid if it has no members', function() {
		expect(function() {
			new ResourceIdentifierObject({}).validate('');
		}).toBeInvalid(InvalidMemberValueError);
	});

	['type', 'id'].forEach(function(member) {
		it('is valid if "' + member + '" member is a string', function() {
			var obj = {};
			if (member !== 'id')
				obj.id = 'foo';
			if (member !== 'type')
				obj.type = 'foo';

			obj[member] = 'foo';

			expect(function() {
				new ResourceIdentifierObject(obj).validate('');
			}).toBeValid();
		});

		it('is invalid if "' + member + '" member is missing or NOT a string', function() {
			var obj = {};
			if (member !== 'id')
				obj.id = 'foo';
			if (member !== 'type')
				obj.type = 'foo';

			expect(function() {
				new ResourceIdentifierObject(obj).validate('');
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'ResourceIdentifierObject',
					member: member,
					pointer: '/' + member
				}, obj);

			[void 0, [], 500, null, {}].forEach(function(value) {
				obj[member] = value;
				expect(function() {
					new ResourceIdentifierObject(obj).validate('');
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'ResourceIdentifierObject',
						member: member,
						pointer: '/' + member
					}, obj);
			});
		});
	});

	it('validate method should return "this"', function() {
		var objInstance = new ResourceIdentifierObject({
			id: 'foo',
			type: 'bar'
		});
		expect(objInstance.validate(''))
			.toBe(objInstance);
	});
});
