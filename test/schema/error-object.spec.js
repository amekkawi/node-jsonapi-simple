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
		}).toNotThrow();
	});

	it('validate method should return "this"', function() {
		var objInstance = new ErrorObject({});
		expect(objInstance.validate())
			.toBe(objInstance);
	});

	['status', 'code'].forEach(function(member) {
		it('is valid if "' + member + '" is a member and is a string', function() {
			['', '500', 'alpha'].forEach(function(value) {
				var obj = {};
				obj[member] = value;
				expect(function() {
					new ErrorObject(obj).validate();
				})
					.toNotThrowForValue(null, value);
			});
		});

		it('is invalid if "' + member + '" is a member and is NOT a string', function() {
			[void 0, {}, [], 500, null].forEach(function(value) {
				var obj = {};
				obj[member] = value;
				expect(tryReturn(function() {
					new ErrorObject(obj).validate();
				}))
					.toBeAForValue(InvalidMemberValueError, value)
					.toInclude({
						objectName: 'ErrorObject',
						member: member,
						memberPath: []
					});
			});
		});
	});

	it('is valid if "source" is an empty object', function() {
		expect(function() {
			new ErrorObject({
				source: {}
			}).validate();
		})
			.toNotThrow();
	});

	it('is invalid if "source" is a member and is NOT an object', function() {
		[void 0, [], 500, null, '500'].forEach(function(value) {
			expect(tryReturn(function() {
				new ErrorObject({
					source: value
				}).validate();
			}))
				.toBeAForValue(InvalidMemberValueError, value)
				.toInclude({
					objectName: 'ErrorObject',
					member: 'source',
					memberPath: []
				});
		});
	});

	['pointer', 'parameter'].forEach(function(member) {
		it('is valid if "' + member + '" is a member and is a string', function() {
			var obj = {source: {}};
			obj.source[member] = 'foo';
			expect(function() {
				new ErrorObject(obj).validate();
			})
				.toNotThrow();
		});

		it('is invalid if "' + member + '" is a member of "source" and is NOT a string', function() {
			[void 0, [], 500, null, {}].forEach(function(value) {
				var obj = {source: {}};
				obj.source[member] = value;
				expect(tryReturn(function() {
					new ErrorObject(obj).validate();
				}))
					.toBeAForValue(InvalidMemberValueError, value)
					.toInclude({
						objectName: 'ErrorObject',
						member: member,
						memberPath: ['source']
					});
			});
		});
	});

	it('is valid if "source" has other members', function() {
		expect(function() {
			new ErrorObject({
				source: {
					foo: 'bar'
				}
			}).validate().toJSON();
		})
			.toNotThrow();
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
		it('is valid if "' + member + '" is a member and is an object', function() {
			var obj = {
				type: 'foo',
				id: 'bar'
			};
			obj[member] = {};
			expect(function() {
				new ErrorObject(obj).validate();
			})
				.toNotThrow();
		});

		it('is invalid if "' + member + '" is a member and is NOT an object', function() {
			[void 0, [], 500, null, '500'].forEach(function(value) {
				var obj = {
					type: 'foo',
					id: 'bar'
				};
				obj[member] = value;
				expect(tryReturn(function() {
					new ErrorObject(obj).validate();
				}))
					.toBeAForValue(InvalidMemberValueError, value)
					.toInclude({
						objectName: 'ErrorObject',
						member: member,
						memberPath: []
					});
			});
		});
	});
});
