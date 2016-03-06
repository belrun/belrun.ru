'use strict';

var Steppy = require('twostep').Steppy;

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		Steppy(
			function() {
				// underconstruction message
				res.render('main');
			},
			next
		);
	});
};
