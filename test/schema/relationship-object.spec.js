"use strict";

var expect = require('expect');
var util = require('../../lib/util');
var RelationshipObject = require('../../lib/schema/relationship-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');
var InvalidObjectError = require('../../lib/errors/invalid-object-error');

describe('Relationship Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(RelationshipObject.prototype[member]).toBeA('function');
			});
	});

	it('should have expected prototype setter methods', function() {
		['links', 'data', 'meta']
			.forEach(function(member) {
				expect(RelationshipObject.prototype['set' + util.upperFirst(member)]).toBeA('function');
			});
	});

	// TODO: Test that set* works as expected

	it('is invalid if it has no members', function() {
		expect(function() {
			new RelationshipObject({}).validate();
		}).toThrow(InvalidObjectError);
	});

	it('is invalid if "data" is a member and is NOT an object, array or null', function() {
		[null, [], {type: 'foo', id: 'bar'}].forEach(function(value) {
			expect(function() {
				new RelationshipObject({
					data: value
				}).validate();
			}).toBeValid(value);
		});

		[void 0, 500, '500'].forEach(function(value) {
			expect(function() {
				new RelationshipObject({
					data: value
				}).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'RelationshipObject',
					member: 'data',
					memberPath: []
				}, value);
		});
	});

	it('is invalid if "data" is a member is an array and its values are NOT objects', function() {
		[void 0, [], 500, null, '500'].forEach(function(value) {
			expect(function() {
				new RelationshipObject({
					data: [
						value
					]
				}).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'RelationshipObject',
					member: '0',
					memberPath: ['data']
				}, value);
		});
	});

	['links', 'meta'].forEach(function(member) {
		it('is invalid if "' + member + '" is a member and is NOT an object', function() {
			[void 0, 	[], 500, null, '500'].forEach(function(value) {
				var obj = {};
				obj[member] = value;
				expect(function() {
					new RelationshipObject(obj).validate();
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'RelationshipObject',
						member: member,
						memberPath: []
					}, value);
			});
		});
	});

	it('validate method should return "this"', function() {
		var objInstance = new RelationshipObject({
			meta: {}
		});
		expect(objInstance.validate())
			.toBe(objInstance);
	});
});
