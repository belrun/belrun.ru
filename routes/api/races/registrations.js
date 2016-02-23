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

			db.registrations.find({raceId: params.raceId}).toArray(this.slot());
		},
		function(err, registrations) {
			res.json({registrations: registrations});
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
				name: {required: true, type: 'string', minLength: 1}
			});

			db.races.findOne({_id: params.raceId}, {_id: 1}, this.slot());
		},
		function(err, race) {
			if (!race) throw new Error('Race is not found');

			db.registrations.insertOne(params, this.slot());
		},
		function(err, registration) {
			res.json({registration: registration});
		},
		next
	);
});

module.exports = router;
