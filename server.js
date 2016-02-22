'use strict';

var express = require('express');
var fs = require('fs');
var Steppy = require('twostep').Steppy;
var path = require('path');
var routes = require('./routes');
var db = require('./db');
var locals = require('./helpers/locals');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');

var config = require('./config');

var createApp = function(callback) {
	Steppy(
		function() {
			var app = express();

			app.set('env', config.env);
			app.set('config', config);

			app.set('view engine', 'jade');
			app.set('views', './views');

			app.disable('x-powered-by');

			app.locals = locals;

			app.use(morgan('dev'));

			app.use(compression());

			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({extended: true}));

			app.use(express.static(path.join(__dirname, 'public'), {
				lastModified: true
			}));

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
		console.error(err.stack);
		process.exit(1);
	} else {

	}
});
