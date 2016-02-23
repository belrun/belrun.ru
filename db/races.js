'use strict';

var db = require('./index');
var Steppy = require('twostep').Steppy;

exports.options = {
	changeDataMethods: ['updateOne']
};

exports.init = function(collection) {
	collection.addPlugin('sequenceId');

	db.registrations.on('afterInsertOne', function(params, callback) {
		Steppy(
			function() {
				collection.updateOne(
					{_id: params.obj.raceId},
					{$inc: {registrationsCount: 1}},
					this.slot()
				);
			},
			callback
		);
	});
};
