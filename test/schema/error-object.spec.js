"use strict";

var expect = require('expect');
var ErrorObject = require('../../lib/schema/error-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

describe('Error Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(ErrorObject.prototype[member]).toBeA('function', 'Expected "' + member + '" of %s to be a %s');
			});
	});

	it('should allow no arguments constructor', function() {
		new ErrorObject();
	});

	it('should set members through constructor, "set" method, and named setter methods', function() {
		expect(ErrorObject)
			.toSetMembers(['id', 'links', 'status', 'code', 'title', 'detail', 'source', 'meta']);
	});

	it('is valid with no members', function() {
		expect(function() {
			new ErrorObject({}).validate('');
		}).toBeValid();
	});

	['status', 'code', 'title', 'detail'].forEach(function(member) {
		it('is valid if "' + member + '" is a string', function() {
			['', '500', 'alpha'].forEach(function(value) {
				var obj = {};
				obj[member] = value;
				expect(function() {
					new ErrorObject(obj).validate('');
				}).toBeValid(value);
			});
		});

		it('is invalid if "' + member + '" is NOT a string', function() {
			[void 0, {}, [], 500, null].forEach(function(value) {
				var obj = {};
				obj[member] = value;
				expect(function() {
					new ErrorObject(obj).validate('');
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'ErrorObject',
						member: member,
						pointer: '/' + member
					}, value);
			});
		});
	});

	it('is valid if "source" is an empty object', function() {
		expect(function() {
			new ErrorObject({
				source: {}
			}).validate('');
		}).toBeValid();
	});

	it('is invalid if "source" is a member and is NOT an object', function() {
		[void 0, [], 500, null, '500'].forEach(function(value) {
			expect(function() {
				new ErrorObject({
					source: value
				}).validate('');
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'ErrorObject',
					member: 'source',
					pointer: '/source'
				}, value);
		});
	});

	['pointer', 'parameter'].forEach(function(member) {
		it('is valid if "' + member + '" is a member and is a string', function() {
			var obj = {source: {}};
			obj.source[member] = 'foo';
			expect(function() {
				new ErrorObject(obj).validate('');
			}).toBeValid();
		});

		it('is invalid if "' + member + '" is a member of "source" and is NOT a string', function() {
			[void 0, [], 500, null, {}].forEach(function(value) {
				var obj = {source: {}};
				obj.source[member] = value;
				expect(function() {
					new ErrorObject(obj).validate('');
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'ErrorObject',
						member: member,
						pointer: '/source/' + member
					}, value);
			});
		});
	});

	it('is valid if "source" has other members', function() {
		expect(function() {
			new ErrorObject({
				source: {
					foo: 'bar'
				}
			}).validate('').toJSON();
		}).toBeValid();
	});

	it('returns all provided members for "source"', function() {
		expect(new ErrorObject({
			source: {
				foo: 500,
				bar: {},
				pointer: 'foo',
				parameter: 'bar'
			}
		}).toJSON())
			.toEqual({
				source: {
					foo: 500,
					bar: {},
					pointer: 'foo',
					parameter: 'bar'
				}
			});
	});

	['links', 'meta'].forEach(function(member) {
		it('is valid if "' + member + '" is an object', function() {
			var obj = {
				type: 'foo',
				id: 'bar'
			};
			obj[member] = {};
			expect(function() {
				new ErrorObject(obj).validate('');
			}).toBeValid();
		});

		it('is invalid if "' + member + '" is a member and is NOT an object', function() {
			[void 0, [], 500, null, '500'].forEach(function(value) {
				var obj = {
					type: 'foo',
					id: 'bar'
				};
				obj[member] = value;
				expect(function() {
					new ErrorObject(obj).validate('');
				})
					.toBeInvalid(InvalidMemberValueError, {
						objectName: 'ErrorObject',
						member: member,
						pointer: '/' + member
					}, value);
			});
		});
	});

	it('validate method should return "this"', function() {
		var objInstance = new ErrorObject({});
		expect(objInstance.validate(''))
			.toBe(objInstance);
	});
});
