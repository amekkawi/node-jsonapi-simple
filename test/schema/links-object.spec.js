"use strict";

var expect = require('expect');
var util = require('../../lib/util');
var LinksObject = require('../../lib/schema/links-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

function tryReturn(fn) {
	try {
		return fn();
	}
	catch (err) {
		return err;
	}
}

describe('Links Object', function() {
	it('should have expected prototype methods', function() {
		['set', 'validate', 'toJSON']
			.forEach(function(member) {
				expect(LinksObject.prototype[member]).toBeA('function');
			});
	});

	it('is valid with no members', function() {
		expect(function() {
			new LinksObject({}).validate();
		}).toNotThrow(null);
	});

	var objInstance = new LinksObject({});
	expect(objInstance.validate())
		.toBe(objInstance, 'validate returns "this"');

	it('is invalid if a member is NOT a string or object', function() {
		[void 0, [], 500, null].forEach(function(value) {
			expect(tryReturn(function() {
				new LinksObject({
					self: value
				}).validate();
			}))
				.toBeA(InvalidMemberValueError)
				.toInclude({
					objectName: 'LinksObject',
					member: 'self',
					memberPath: []
				});
		});
	});

	it('is valid if a member is a object and has no members', function() {
		expect(function() {
			new LinksObject({
				self: {}
			}).validate();
		})
			.toNotThrow(null);
	});

	it('is invalid if a link has a "href" member that is NOT a string', function() {
		[void 0, [], {}, 500, null].forEach(function(value) {
			expect(tryReturn(function() {
				new LinksObject({
					self: {
						href: value
					}
				}).validate();
			}))
				.toBeA(InvalidMemberValueError)
				.toInclude({
					objectName: 'LinkObject',
					member: 'href',
					memberPath: ['self']
				});
		});
	});

	it('is invalid if a link has a "meta" member that is NOT an object', function() {
		[void 0, [], 500, null, '500'].forEach(function(value) {
			expect(tryReturn(function() {
				new LinksObject({
					self: {
						meta: value
					}
				}).validate();
			}))
				.toBeA(InvalidMemberValueError)
				.toInclude({
					objectName: 'LinkObject',
					member: 'meta',
					memberPath: ['self']
				});
		});
	});
});
