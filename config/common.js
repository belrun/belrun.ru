'use strict';

var configBuilder = require('./builder');

configBuilder.register({
	name: 'common',
	config: {
		env: 'development',
		listen: {
			host: '127.0.0.1',
			port: 8080
		},
		mongodb: {
			url: 'mongodb://127.0.0.1:27017/belrun'
		},
		mailer: {}
	}
});
