'use strict';

var wascally = require('wascally');
var _ = require('underscore');

var topology = require('./topology');

var initialized = false;

// initialize handlers
var handlerNames = ['sendMail'];

_(handlerNames).each(function(handlerName) {
	require('./handlers/' + handlerName);
});

exports.init = function(connectionOptions, callback) {
	if (initialized) throw new Error('MQ connection is already initialized');

	var config = _({connection: connectionOptions}).extend(topology);

	wascally.configure(config).then(function() {
		initialized = true;

		console.log('Connection to MQ server is established');

		callback();
	}, callback);
};

exports.publish = function() {
	if (!initialized) throw new Error('MQ connection is not initialized');

	var args = _(arguments).initial();
	var callback = _(arguments).last();

	wascally.publish.apply(wascally, args).then(callback, callback);
};

exports.close = function(callback) {
	if (!initialized) return callback();

	wascally.once('closed', function() {
		initialized = false;

		callback();
	});

	wascally.closeAll();
};
