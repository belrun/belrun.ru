'use strict';

var express = require('express');
var Steppy = require('twostep').Steppy;
var db = require('../../../db');

var registrationsRouter = require('./registrations');

var router = express.Router();

router.use('/:raceId/registrations', registrationsRouter);

router.get('/', function(req, res, next) {
	Steppy(
		function() {
			db.races.find().toArray(this.slot());
		},
		function(err, races) {
			res.json({races: races});
		},
		next
	);
});

router.get('/:_id', function(req, res, next) {
	Steppy(
		function() {
			var params = req.validate({
				_id: {required: true, type: 'integer', minimum: 1}
			});

			db.races.findOne({_id: params._id}, this.slot());
		},
		function(err, race) {
			if (!race) throw new Error('Race is not found');

			res.json({race: race});
		},
		next
	);
});

module.exports = router;
