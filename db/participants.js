'use strict';

var db = require('./index');
var _ = require('underscore');
var Steppy = require('twostep').Steppy;

exports.options = {
	changeDataMethods: ['insertOne']
};

exports.init = function(collection) {
	collection.addPlugin('sequenceId');
	collection.addPlugin('createDate');

	collection.on('beforeInsertOne', function(params, callback) {
		var obj = params.obj;
		var raceId = obj.race._id;

		Steppy(
			function() {
				db.races.findOne({_id: raceId}, {registration: 1}, this.slot());
			},
			function(err, race) {
				if (!race) {
					throw new Error('Race is not found');
				}

				if (!_.isObject(race.registration)) {
					throw new Error('Race doesn\'t have a registration');
				}

				var now = Date.now();

				if (now < race.registration.beginDate) {
					throw new Error('Registration hasn\'t begun yet');
				}

				if (now >= race.registration.endDate) {
					throw new Error('Registration have already ended');
				}

				collection.findOne({'race._id': raceId, email: obj.email}, {_id: 1}, this.slot());
			},
			function(err, participant) {
				if (participant) {
					throw new Error('You are already registered to this race');
				}

				// get next number if race has registration
				db.races.findOneAndUpdate(
					{_id: raceId},
					{
						$inc: {
							'registration.number': 1,
							'registration.participantsCount': 1
						}
					},
					{
						projection: {
							'registration.number': 1
						}
					},
					this.slot()
				);
			},
			function(err, race) {
				obj.number = race.registration.number;

				this.pass(null);
			},
			callback
		);
	});
};
