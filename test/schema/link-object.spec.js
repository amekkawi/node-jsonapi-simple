"use strict";

var expect = require('expect');
var util = require('../../lib/util');
var LinkObject = require('../../lib/schema/link-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

describe('Link Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(LinkObject.prototype[member]).toBeA('function');
			});
	});

	it('should have expected prototype setter methods', function() {
		['href', 'meta']
			.forEach(function(member) {
				expect(LinkObject.prototype['set' + util.upperFirst(member)]).toBeA('function');
			});
	});

	// TODO: Test that set* works as expected

	it('is valid with no members', function() {
		expect(function() {
			new LinkObject({}).validate();
		}).toBeValid();
	});

	it('validate method should return "this"', function() {
		var objInstance = new LinkObject({});
		expect(objInstance.validate())
			.toBe(objInstance);
	});

	it('is valid if "href" is a member and is a string', function() {
		expect(function() {
			new LinkObject({
				href: 'foo'
			}).validate();
		}).toBeValid();
	});

	it('is invalid if "href" is a member and is NOT a string', function() {
		[void 0, {}, [], 500, null].forEach(function(value) {
			expect(function() {
				new LinkObject({
					href: value
				}).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'LinkObject',
					member: 'href',
					memberPath: []
				}, value);
		});
	});

	it('is valid if "meta" is a member and is an object', function() {
		expect(function() {
			new LinkObject({
				meta: {}
			}).validate();
		}).toBeValid();
	});

	it('is invalid if "meta" is a member and is NOT an object', function() {
		[void 0, [], 500, null, '500'].forEach(function(value) {
			expect(function() {
				new LinkObject({
					meta: value
				}).validate();
			})
				.toBeInvalid(InvalidMemberValueError, {
					objectName: 'LinkObject',
					member: 'meta',
					memberPath: []
				}, value);
		});
	});
});
