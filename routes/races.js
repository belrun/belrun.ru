'use strict';

var db = require('../db');
var Steppy = require('twostep').Steppy;

module.exports = function(app) {
	// temporary hardcode gagarin-2016 here
	app.get('/:name(gagarin-2016)', function(req, res, next) {
		Steppy(
			function() {
				var params = req.validate({
					name: {required: true, type: 'string', minLength: 1}
				});

				db.races.findOne({name: params.name}, this.slot());
			},
			function(err, race) {
				if (!race) throw new Error('Race is not found');

				res.render('races/special/' + race.name, {
					race: race
				});
			},
			next
		);
	});
};
