'use strict';

var express = require('express');
var Steppy = require('twostep').Steppy;
var db = require('../../../db');

var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
	Steppy(
		function() {
			var params = req.validate({
				raceId: {required: true, type: 'integer', minimum: 1}
			});

			db.participants.find({raceId: params.raceId}, {email: 0}).toArray(this.slot());
		},
		function(err, participants) {
			res.json({participants: participants});
		},
		next
	);
});

router.post('/', function(req, res, next) {
	var params;

	Steppy(
		function() {
			params = req.validate({
				raceId: {required: true, type: 'integer', minimum: 1},
				email: {required: true, type: 'string', format: 'email'},
				firstName: {required: true, type: 'string', minLength: 1},
				lastName: {required: true, type: 'string', minLength: 1}
			});

			db.races.findOne({_id: params.raceId}, {registration: 1}, this.slot());
		},
		function(err, race) {
			if (!race) {
				throw new Error('Race is not found');
			}

			if (!race.registration) {
				throw new Error('Race doesn\'t have a registration');
			}

			if (Date.now() < race.registration.beginDate) {
				throw new Error('Registration hasn\'t begun yet');
			}

			if (Date.now() >= race.registration.endDate) {
				throw new Error('Registration have already ended');
			}

			db.participants.insertOne(params, this.slot());
		},
		function(err, participant) {
			res.json({participant: participant});
		},
		next
	);
});

module.exports = router;
