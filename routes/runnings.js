'use strict';

module.exports = function(app) {
	app.get('/runnings', function(req, res, next) {
		res.send('runnings');
	});
};
