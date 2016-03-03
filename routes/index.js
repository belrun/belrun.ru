'use strict';

var _ = require('underscore');

var files = ['api', 'site'];

var routes = _(files).map(function(file) {
	return require('./' + file);
});

module.exports = function(app) {
	_(routes).each(function(route) {
		route(app);
	});
};
