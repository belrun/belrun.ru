'use strict';

var db = require('./index');
var Steppy = require('twostep').Steppy;

exports.options = {
	changeDataMethods: ['insertOne']
};

exports.init = function(collection) {
	collection.addPlugin('sequenceId');
	collection.addPlugin('createDate');

	collection.on('beforeInsertOne', function(params, callback) {
		var obj = params.obj;

		Steppy(
			function() {
				db.races.findOne({_id: obj.raceId}, {registration: 1}, this.slot());
			},
			function(err, race) {
				if (race && race.registration) {
					db.races.findOneAndUpdate(
						{_id: obj.raceId},
						{$inc: {'registration.participantsCount': 1}},
						{
							projection: {'registration.participantsCount': 1},
							returnOriginal: false
						},
						this.slot()
					);
				} else {
					this.pass(null);
				}
			},
			function(err, race) {
				if (race) {
					obj.number = race.registration.participantsCount;
				}

				this.pass(null);
			},
			callback
		);
	});
};
