'use strict';

var Steppy = require('twostep').Steppy;
var path = require('path');
var db = require('../db');

module.exports = function(app) {
	// temporary hardcode gagarin-2016 here
	app.get('/races/:name(gagarin-2016)', function(req, res, next) {
		Steppy(
			function() {
				var params = req.validate({
					name: {required: true, type: 'string', minLength: 1}
				});

				db.races.findOne({name: params.name}, this.slot());
			},
			function(err, race) {
				if (!race) {
					throw new Error('Race is not found');
				}

				res.render(path.join('races', race.layout), {
					race: race
				});
			},
			next
		);
	});
};
