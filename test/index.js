"use strict";

var expect =  require('expect');
var inspect = require('object-inspect');

expect.extend({
	toBeAForValue: function(error, value) {
		expect(this.actual)
			.toBeA(
				error,
				'Expected %s to be a %s for value ' + inspect(value)
			);
		return this
	},
	toNotThrowForValue: function(error, value) {
		expect(this.actual)
			.toNotThrow(
				error,
				'Expected %s to not throw %s for value ' + inspect(value)
			);
		return this
	}
});

require('./schema/attributes-object.spec');
require('./schema/meta-object.spec');
require('./schema/resource-object.spec');
require('./schema/error-object.spec');
require('./schema/link-object.spec');
require('./schema/links-object.spec');
require('./schema/relationship-object.spec');
