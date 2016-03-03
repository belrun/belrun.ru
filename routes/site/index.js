'use strict';

var _ = require('underscore');
var express = require('express');

var router = express.Router();

var files = ['main', 'races'];

_(files).each(function(file) {
	require('./' + file)(router);
});

module.exports = function(app) {
	app.use('/', router);
};
