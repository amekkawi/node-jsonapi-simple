"use strict";

var expect = require('expect');
var util = require('../../lib/util');
var ErrorObject = require('../../lib/schema/error-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

function tryReturn(fn) {
	try {
		return fn();
	}
	catch (err) {
		return err;
	}
}

describe('Error Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(ErrorObject.prototype[member]).toBeA('function');
			});
	});

	it('should have expected prototype setter methods', function() {
		['id', 'links', 'status', 'code', 'title', 'detail', 'source', 'meta']
			.forEach(function(member) {
				expect(ErrorObject.prototype['set' + util.upperFirst(member)]).toBeA('function');
			});
	});

	// TODO: Test that set* works as expected

	it('is valid with no members', function() {
		expect(function() {
			new ErrorObject({}).validate();
		}).toNotThrow(null);
	});

	var objInstance = new ErrorObject({});
	expect(objInstance.validate())
		.toBe(objInstance, 'validate returns "this"');

	it('is invalid if "status" is a member and is NOT a string', function() {
		[{}, [], 500, null].forEach(function(value) {
			expect(tryReturn(function() {
				new ErrorObject({
					status: value
				}).validate();
			}))
				.toBeA(InvalidMemberValueError)
				.toInclude({
					objectName: 'ErrorObject',
					member: 'status',
					memberPath: []
				});
		});
	});

	it('is invalid if "code" is a member and is NOT a string', function() {
		[{}, [], 500, null].forEach(function(value) {
			expect(tryReturn(function() {
				new ErrorObject({
					code: value
				}).validate();
			}))
				.toBeA(InvalidMemberValueError)
				.toInclude({
					objectName: 'ErrorObject',
					member: 'code',
					memberPath: []
				});
		});
	});

	it('is invalid if "source" is a member and is NOT an object', function() {
		[[], 500, null, '500'].forEach(function(value) {
			expect(tryReturn(function() {
				new ErrorObject({
					source: value
				}).validate();
			}))
				.toBeA(InvalidMemberValueError)
				.toInclude({
					objectName: 'ErrorObject',
					member: 'source',
					memberPath: []
				});
		});
	});

	['pointer', 'parameter'].forEach(function(member) {
		it('is invalid if "' + member + '" member is specified and is NOT a string', function() {
			[[], 500, null, {}].forEach(function(value) {
				var obj = {source: {}};
				obj.source[member] = value;
				expect(tryReturn(function() {
					new ErrorObject(obj).validate();
				}))
					.toBeA(InvalidMemberValueError)
					.toInclude({
						objectName: 'ErrorObject',
						member: member,
						memberPath: ['source']
					});
			});
		});
	});

	['links', 'meta'].forEach(function(member) {
		it('is invalid if "' + member + '" member is specified and is NOT an object', function() {
			[[], 500, null, '500'].forEach(function(value) {
				var obj = {
					type: 'foo',
					id: 'bar'
				};
				obj[member] = value;
				expect(tryReturn(function() {
					new ErrorObject(obj).validate();
				}))
					.toBeA(InvalidMemberValueError)
					.toInclude({
						objectName: 'ErrorObject',
						member: member,
						memberPath: []
					});
			});
		});
	});
});
