'use strict';

var conform = require('conform');
var _ = require('underscore');

module.exports = function(data, schema, options) {
	conform.validate(data, schema, _({}).defaults(options, {
		cast: true,
		castSource: true,
		additionalProperties: false,
		applyDefaultValue: true,
		failOnFirstError: true
	}));

	return data;
};
