'use strict';

var Steppy = require('twostep').Steppy;

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		Steppy(
			function() {
				// temporary redirect to gagarin-2016 race
				res.redirect(302, '/races/gagarin-2016');
			},
			next
		);
	});
};
