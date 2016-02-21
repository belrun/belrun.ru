'use strict';

var _ = require('underscore');

var routes = ['main', 'races'];

module.exports = function(app) {
	_(routes).each(function(route) {
		require('./' + route)(app);
	});
};
