'use strict';

var express = require('express');
var _ = require('underscore');
var Steppy = require('twostep').Steppy;
var db = require('../../../db');
var mq = require('../../../logic/mq');

var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
	Steppy(
		function() {
			var params = req.validate({
				raceId: {required: true, type: 'integer', minimum: 1}
			});

			db.participants
				.find({'race._id': params.raceId}, {email: 0})
				.sort({_id: 1})
				.toArray(this.slot());
		},
		function(err, participants) {
			res.json({participants: participants});
		},
		next
	);
});

router.get('/:_id(\\d+)', function(req, res, next) {
	Steppy(
		function() {
			var params = req.validate({
				raceId: {required: true, type: 'integer', minimum: 1},
				_id: {required: true, type: 'integer', minimum: 1}
			});

			db.participants.findOne({_id: params._id, 'race._id': params.raceId}, {email: 0}, this.slot());
		},
		function(err, participant) {
			if (!participant) {
				throw new Error('Participant is not found');
			}

			res.json({participant: participant});
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

			var participant = _(params)
				.chain()
				.pick('email', 'firstName', 'lastName')
				.extend({race: {_id: params.raceId}})
				.value();

			db.participants.insertOne(participant, this.slot());
		},
		function(err, participant) {
			this.pass(participant);

			mq.publish('sender', {
				type: 'sender.sendMail',
				body: {
					template: 'registration/complete',
					to: participant.email
				}
			}, this.slot());
		},
		function(err, participant) {
			res.json({participant: participant});
		},
		next
	);
});

module.exports = function(app) {
	app.use('/:raceId/participants', router);
};
