'use strict';

var express = require('express');
var Steppy = require('twostep').Steppy;
var _ = require('underscore');
var db = require('../../../db');

var router = express.Router();

router.get('/', function(req, res, next) {
	Steppy(
		function() {
			var params = req.validate({
				name: {type: 'string', minLength: 1}
			});

			db.races
				.find(_(params).pick('name'))
				.sort({_id: 1})
				.toArray(this.slot());
		},
		function(err, races) {
			res.json({races: races});
		},
		next
	);
});

router.get('/:_id(\\d+)', function(req, res, next) {
	Steppy(
		function() {
			var params = req.validate({
				_id: {required: true, type: 'integer', minimum: 1}
			});

			db.races.findOne({_id: params._id}, this.slot());
		},
		function(err, race) {
			if (!race) {
				throw new Error('Race is not found');
			}

			res.json({race: race});
		},
		next
	);
});

module.exports = function(app) {
	app.use('/', router);
};
