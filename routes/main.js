'use strict';

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		res.redirect(302, '/races/special/gagarin-2016');
	});
};
