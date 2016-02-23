'use strict';

var _ = require('underscore');

var routes = ['api', 'main', 'races'];

module.exports = function(app) {
	_(routes).each(function(route) {
		require('./' + route)(app);
	});
};
