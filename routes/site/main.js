'use strict';

var Steppy = require('twostep').Steppy;

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		Steppy(
			function() {
				// @todo remove "under construction" view when everything is done
				res.render('main');
			},
			next
		);
	});
};
