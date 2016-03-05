'use strict';

var express = require('express');
var Steppy = require('twostep').Steppy;
var _ = require('underscore');
var routes = require('./routes');
var db = require('./db');
var locals = require('./utils/locals');
var mq = require('./logic/mq');
var scheduler = require('./logic/scheduler');

// middlewares
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var reqValidate = require('./middlewares/reqValidate');

var config = require('./config');

var stopSignals = [
	'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
	'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
];

process.env.TZ = config.timezone;

var createApp = function(callback) {
	Steppy(
		function() {
			var app = express();

			// setup app options
			app.set('env', config.env);
			app.set('config', config);

			app.set('view engine', 'jade');
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
			mq.init(config.mq, this.slot());
		},
		function() {
			createApp(this.slot());

			scheduler.start();
		},
		function(err, app) {
			this.pass(app);

			app.httpServer = app.listen(
				config.listen.port,
				config.listen.host,
				this.slot()
			);
		},
		function(err, app) {
			console.log('Listening on %s:%s', config.listen.host, config.listen.port);

			this.pass(app);
		},
		callback
	);
};

var stop = function(app) {
	Steppy(
		function() {
			scheduler.stop();

			if (app.httpServer) {
				console.log('Stopping http server, it can take up to %s ms', app.httpServer.timeout);

				app.httpServer.close(this.slot());
			} else {
				this.pass(null);
			}
		},
		function() {
			console.log('Closing MQ connection');

			mq.close(this.slot());
		},
		function(err) {
			if (err) {
				console.error(err.stack);
				process.exit(1);
			} else {
				process.exit(0);
			}
		}
	);
};

start(function(err, app) {
	if (err) {
		console.error(err.stack);
		process.exit(1);
	} else {
		_(stopSignals).each(function(stopSignal) {
			process.once(stopSignal, function() {
				console.log('Got %s, stopping application...', stopSignal);

				stop(app);
			});
		});
	}
});
