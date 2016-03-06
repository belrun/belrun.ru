'use strict';

var Steppy = require('twostep').Steppy;

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		Steppy(
			function() {
				res.render('main');
			},
			next
		);
	});
};
