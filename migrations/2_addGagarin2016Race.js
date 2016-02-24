'use strict';

var Steppy = require('twostep').Steppy;
var Collection = require('mongodbext').Collection;

exports.migrate = function(client, done) {
	var racesCol = new Collection(client.db, 'races', {
		changeDataMethods: ['insertOne']
	});

	racesCol.addPlugin('sequenceId');
	racesCol.addPlugin('createDate');
	racesCol.addPlugin('updateDate');

	Steppy(
		function() {
			racesCol.insertOne({
				name: 'gagarin-2016',
				title: 'Забег в честь первого полёта в космос',
				description: '',
				distance: 5000,
				date: 1460271600000,
				address: 'г. Белгород, Центральный парк',
				layout: 'gagarin-2016',
				registration: {
					// beginDate: 1457593200000,
					beginDate: Date.now(),
					endDate: 1460098800000,
					participantsCount: 0
				}
			}, this.slot());
		},
		done
	);
};
