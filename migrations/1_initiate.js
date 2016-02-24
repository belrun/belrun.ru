'use strict';

var Steppy = require('twostep').Steppy;

exports.migrate = function(client, done) {
	var db = client.db;

	var racesCol = db.collection('races');
	var participantsCol = db.collection('participants');

	Steppy(
		function() {
			racesCol.createIndex(
				{name: 1},
				{unique: true},
				this.slot()
			);

			participantsCol.createIndex(
				{email: 1, raceId: 1},
				{unique: true},
				this.slot()
			);
		},
		done
	);
};
