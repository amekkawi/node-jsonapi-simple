"use strict";

var expect =  require('expect');
var TestUtils =  require('expect/lib/TestUtils');
var inspect = require('object-inspect');

function formatMessage(message, args) {
	var index = 0;
	return message.replace(/%s/g, function () {
		return inspect(args[index++]);
	});
}

function upperFirst(str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
}

expect.extend({
	toBeValid: function(value) {
		expect.assert(
			TestUtils.isFunction(this.actual),
			'The "actual" argument in expect(actual).toBeValid() must be a function, %s was given',
			this.actual
		);

		try {
			this.actual.apply(this.context, this.args);
		}
		catch (err) {
			var throwErr = new Error(formatMessage(
				'Expected %s to not throw %s' + (arguments.length > 0 ? ' for value %s' : ''),
				[this.actual, err.constructor || 'an error', value]
			));
			throwErr.stack = throwErr.message + '\n' + err.stack;
			throw throwErr;
		}

		return this;
	},
	toBeInvalid: function(errorType, props, value) {
		expect.assert(
			TestUtils.isFunction(this.actual),
			'The "actual" argument in expect(actual).toBeInvalid() must be a function, %s was given',
			this.actual
		);

		try {
			this.actual.apply(this.context, this.args);
		}
		catch (err) {
			if (!(err instanceof errorType)) {
				var throwErr = new Error(formatMessage(
					'Expected %s to throw an instance of %s instead of %s' + (arguments.length > 2 ? ' for value %s' : ''),
					[this.actual, errorType || 'an error', err.constructor, value]
				));
				throwErr.stack = throwErr.message + '\n' + err.stack;
				throw throwErr;
			}

			if (props)
				expect(err).toInclude(props, 'Expected %s to include %s' + (arguments.length > 2 ? ' for value ' + inspect(value) : ''));

			return this;
		}

		throw new Error(formatMessage(
			'Expected %s to throw an error' + (arguments.length > 0 ? ' for value %s' : ''),
			[this.actual, value]
		));
	},
	toBeArgs: function(value) {
		expect.assert(
			Array.isArray(value),
			'The "value" argument in expect(actual).toBeArgs(value) must be an array, %s was given',
			value
		);

		expect.assert(
			Array.isArray(this.actual),
			'The "actual" argument in expect(actual).toBeArgs(value) must be an array, %s was given',
			this.actual
		);

		expect(this.actual.length)
			.toBe(value.length, 'Expected args length of %s to be %s');

		for (var i = 0, l = this.actual.length; i < l; i++) {
			expect(this.actual[i])
				.toBe(value[i], 'Expected args[0] %s to be %s');
		}
	},
	toSetMembers: function(props) {
		expect.assert(
			Array.isArray(props),
			'The "props" argument in expect(actual).toSetMembers(props) must be an array, %s was given',
			props
		);

		var Constructor = this.actual;
		expect.assert(
			typeof Constructor === 'function',
			'The "actual" argument in expect(actual).toSetMembers(props) must be a function, %s was given',
			Constructor
		);

		props.forEach(function(member) {
			// Set via constructor
			var obj = {};
			obj[member] = 'TESTVAL';
			var instanceA = new Constructor(obj);
			expect(instanceA.props[member]).toBe('TESTVAL', 'Expected "' + member + '" value of %s to be %s');

			// Set using 'set' method
			var instanceB = new Constructor();
			expect(instanceB.props[member]).toBe(void 0, 'Expected previous "' + member + '" value of %s to be %s');
			instanceB.set(member, 'TESTVAL');
			expect(instanceB.props[member]).toBe('TESTVAL', 'Expected new "' + member + '" value of %s to be %s');

			// Named setter method exists
			var methodName = 'set' + upperFirst(member);
			expect(Constructor.prototype[methodName]).toBeA('function', 'Expected "' + methodName + '" of %s to be a %s');

			// Set using named setter method
			var instanceC = new Constructor();
			expect(instanceC.props[member]).toBe(void 0, 'Expected previous "' + member + '" value of %s to be %s');
			instanceC[methodName]('TESTVAL');
			expect(instanceC.props[member]).toBe('TESTVAL', 'Expected new "' + member + '" value of %s to be %s');
		});
		return this;
	},
	toPushMembers: function(props) {
		expect.assert(
			Array.isArray(props),
			'The "props" argument in expect(actual).toSetMembers(props) must be an array, %s was given',
			props
		);

		var Constructor = this.actual;
		expect.assert(
			typeof Constructor === 'function',
			'The "actual" argument in expect(actual).toSetMembers(props) must be a function, %s was given',
			Constructor
		);

		props.forEach(function(member) {
			var methodName = 'push' + upperFirst(member);
			expect(Constructor.prototype[methodName]).toBeA('function', 'Expected "' + methodName + '" of %s to be a %s');

			// TODO: Test push and push* methods
		});

		return this;
	}
});

require('./util/index.spec');
require('./util/json-pointer.spec');
require('./util/members.spec');
require('./schema/meta-object.spec');
require('./schema/attributes-object.spec');
require('./schema/link-object.spec');
require('./schema/links-object.spec');
require('./schema/relationship-object.spec');
require('./schema/resource-identifier-object.spec');
require('./schema/resource-object.spec');
require('./schema/error-object.spec');
require('./schema/document-object.spec');
