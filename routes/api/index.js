'use strict';

var _ = require('underscore');
var express = require('express');

var router = express.Router();

var routes = ['races'];

_(routes).each(function(route) {
	router.use('/' + route, require('./' + route));
});

module.exports = function(app) {
	app.use('/api/v1.0', router);
};
