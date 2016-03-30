"use strict";

var expect = require('expect');
var util = require('../../lib/util');
var LinkObject = require('../../lib/schema/link-object');
var InvalidMemberValueError = require('../../lib/errors/invalid-member-value-error');

function tryReturn(fn) {
	try {
		return fn();
	}
	catch (err) {
		return err;
	}
}

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
		}).toNotThrow(null);
	});

	var objInstance = new LinkObject({});
	expect(objInstance.validate())
		.toBe(objInstance, 'validate returns "this"');

	it('is invalid if "href" is a member and is NOT a string', function() {
		[{}, [], 500, null].forEach(function(value) {
			expect(tryReturn(function() {
				new LinkObject({
					href: value
				}).validate();
			}))
				.toBeA(InvalidMemberValueError)
				.toInclude({
					objectName: 'LinkObject',
					member: 'href',
					memberPath: []
				});
		});
	});

	['links', 'meta'].forEach(function(member) {
		it('is invalid if "meta" member is specified and is NOT an object', function() {
			[[], 500, null, '500'].forEach(function(value) {
				expect(tryReturn(function() {
					new LinkObject({
						meta: value
					}).validate();
				}))
					.toBeA(InvalidMemberValueError)
					.toInclude({
						objectName: 'LinkObject',
						member: 'meta',
						memberPath: []
					});
			});
		});
	});
});
