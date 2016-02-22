'use strict';

var db = require('../db');
var Steppy = require('twostep').Steppy;

module.exports = function(app) {
	app.get('/:name', function(req, res, next) {
		Steppy(
			function() {
				db.races.findOne({name: req.params.name}, this.slot());
			},
			function(err, race) {
				if (!race) throw new Error('Race is not found');

				res.render('races/special/' + req.params.name, {
					race: race
				});
			},
			next
		);
	});
};
