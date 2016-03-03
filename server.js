'use strict';

var express = require('express');
var Steppy = require('twostep').Steppy;
var routes = require('./routes');
var db = require('./db');
var locals = require('./helpers/locals');
var mailer = require('./logic/mailer');

// middlewares
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var reqValidate = require('./middlewares/reqValidate');

var config = require('./config');

var createApp = function(callback) {
	Steppy(
		function() {
			var app = express();

			// setup app options
			app.set('env', config.env);
			app.set('config', config);

			app.set('view engine', 'jade');
			app.set('view options', {
				doctype: 'html'
			});
			app.set('views', config.paths.siteViews);

			app.disable('x-powered-by');

			app.locals = locals;

			// middlewares
			app.use(morgan('dev'));

			app.use(compression());

			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({extended: true}));

			app.use(express.static(config.paths.public, {
				lastModified: true
			}));

			app.use(reqValidate());

			// routes
			routes(app);

			app.use('/mailer', mailer.queueApp);

			this.pass(app);
		},
		callback
	);
};

var start = function(callback) {
	Steppy(
		function() {
			db.init(config.mongodb, this.slot());
		},
		function() {
			createApp(this.slot());
		},
		function(err, app) {
			app.listen(config.listen.port, config.listen.host, this.slot());
		},
		function() {
			console.log('Listening on %s:%s', config.listen.host, config.listen.port);

			this.pass(null);
		},
		callback
	);
};

start(function(err) {
	if (err) {
		console.error(err.stack || err);
		process.exit(1);
	} else {

	}
});
