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
	}
});

require('./schema/meta-object.spec');
require('./schema/attributes-object.spec');
require('./schema/link-object.spec');
require('./schema/links-object.spec');
require('./schema/relationship-object.spec');
require('./schema/resource-identifier-object.spec');
require('./schema/resource-object.spec');
require('./schema/error-object.spec');
require('./schema/document-object.spec');
