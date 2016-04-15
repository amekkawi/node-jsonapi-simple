"use strict";

var expect = require('expect');
var util = require('../../lib/util');
var ResourceIdentifierObject = require('../../lib/schema/resource-identifier-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

describe('Resource Identifier Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(ResourceIdentifierObject.prototype[member]).toBeA('function');
			});
	});

	it('should have expected prototype setter methods', function() {
		['type', 'id', 'meta']
			.forEach(function(member) {
				expect(ResourceIdentifierObject.prototype['set' + util.upperFirst(member)]).toBeA('function');
			});
	});

	// TODO: Test that set* works as expected

	it('is invalid if it has no members', function() {
		expect(function() {
			new ResourceIdentifierObject({}).validate();
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
				new ResourceIdentifierObject(obj).validate();
			}).toBeValid();
		});

		it('is invalid if "' + member + '" member is missing or NOT a string', function() {
			var obj = {};
			if (member !== 'id')
				obj.id = 'foo';
			if (member !== 'type')
				obj.type = 'foo';

			expect(function() {
				new ResourceIdentifierObject(obj).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'ResourceIdentifierObject',
					member: member,
					memberPath: []
				}, obj);

			[void 0, [], 500, null, {}].forEach(function(value) {
				obj[member] = value;
				expect(function() {
					new ResourceIdentifierObject(obj).validate();
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'ResourceIdentifierObject',
						member: member,
						memberPath: []
					}, obj);
			});
		});
	});

	it('validate method should return "this"', function() {
		var objInstance = new ResourceIdentifierObject({
			id: 'foo',
			type: 'bar'
		});
		expect(objInstance.validate())
			.toBe(objInstance);
	});
});
