"use strict";

var expect = require('expect');
var util = require('../../lib/util');
var DocumentObject = require('../../lib/schema/document-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');
var InvalidObjectError = require('../../lib/errors/invalid-object-error');

describe('Document Object', function() {
	it('should have expected prototype methods', function() {
		['push', 'set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(DocumentObject.prototype[member]).toBeA('function');
			});
	});

	it('should have expected prototype setter methods', function() {
		['links', 'data', 'meta']
			.forEach(function(member) {
				expect(DocumentObject.prototype['set' + util.upperFirst(member)]).toBeA('function');
			});
	});

	it('should have expected prototype pusher methods', function() {
		['data', 'included', 'errors']
			.forEach(function(member) {
				expect(DocumentObject.prototype['push' + util.upperFirst(member)]).toBeA('function');
			});
	});

	// TODO: Test that setters/pushers works as expected

	it('is invalid if it has no members', function() {
		expect(function() {
			new DocumentObject({}).validate();
		}).toBeInvalid(InvalidObjectError, {
			objectName: 'DocumentObject',
			memberPath: [],
			message: 'Invalid DocumentObject: must contain at least one of the following members: data, errors, meta'
		});
	});

	it('is valid if "data" is null or an object', function() {
		[null, { type: 'foo', id: 'bar' }].forEach(function(value) {
			expect(function() {
				new DocumentObject({
					data: value
				}).validate();
			}).toBeValid(value);
		});
	});

	it('is valid if "data" is an empty array or an array of objects', function() {
		[[], [{ type: 'foo', id: 'bar1' }, { type: 'foo', id: 'bar2' }]].forEach(function(value) {
			expect(function() {
				new DocumentObject({
					data: value
				}).validate();
			}).toBeValid(value);
		});
	});

	it('is invalid if "data" is a member and is NOT an object, array or null', function() {
		[void 0, 500, '500'].forEach(function(value) {
			expect(function() {
				new DocumentObject({
					data: value
				}).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'DocumentObject',
					member: 'data',
					memberPath: []
				}, value);
		});
	});

	it('is invalid if "data" is an array and its values are NOT objects', function() {
		[void 0, [], 500, null, '500'].forEach(function(value) {
			expect(function() {
				new DocumentObject({
					data: [
						value
					]
				}).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'DocumentObject',
					member: '0',
					memberPath: ['data']
				}, value);
		});
	});

	['links', 'meta'].forEach(function(member) {
		it('is valid if "' + member + '" is an object', function() {
			var obj = {
				data: []
			};
			obj[member] = {};
			expect(function() {
				new DocumentObject(obj).validate();
			})
				.toBeValid();
		});

		it('is invalid if "' + member + '" is a member and is NOT an object', function() {
			[void 0, 	[], 500, null, '500'].forEach(function(value) {
				var obj = {
					data: []
				};
				obj[member] = value;
				expect(function() {
					new DocumentObject(obj).validate();
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'DocumentObject',
						member: member,
						memberPath: []
					}, value);
			});
		});
	});

	it('is invalid if "links" is a member and is NOT an object, array or null', function() {
		[void 0, 500, '500'].forEach(function(value) {
			expect(function() {
				new DocumentObject({
					data: value
				}).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'DocumentObject',
					member: 'data',
					memberPath: []
				}, value);
		});
	});

	it('validate method should return "this"', function() {
		var objInstance = new DocumentObject({
			meta: {}
		});
		expect(objInstance.validate())
			.toBe(objInstance);
	});
});
