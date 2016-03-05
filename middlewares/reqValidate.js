'use strict';

var validate = require('../utils/validate');
var _ = require('underscore');

module.exports = function() {
	return function(req, res, next) {
		req.validate = function(schema, options) {
			var data = _.extend({}, req.params, req.query, req.body);

			validate(
				data,
				{type: 'object', properties: schema},
				options || {}
			);

			return data;
		};

		next();
	};
};
