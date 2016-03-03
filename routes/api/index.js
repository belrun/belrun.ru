'use strict';

var express = require('express');
var _ = require('underscore');

var router = express.Router();

var files = ['races'];

_(files).each(function(file) {
	require('./' + file)(router);
});

module.exports = function(app) {
	app.use('/api/v1.0', router);
};
