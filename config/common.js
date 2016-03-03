'use strict';

var configBuilder = require('./builder');
var path = require('path');

configBuilder.register({
	name: 'common',
	config: {
		env: 'development',
		timezone: 'Europe/Moscow',
		listen: {
			host: '127.0.0.1',
			port: 9000
		},
		paths: {
			views: path.join(__dirname, '../views'),
			public: path.join(__dirname, '../public'),
			siteViews: function(config) {
				return path.join(config.paths.views, 'site');
			},
			mailerViews: function(config) {
				return path.join(config.paths.views, 'mailer');
			}
		},
		mongodb: {
			url: 'mongodb://127.0.0.1:27017/belrun'
		},
		redis: {
			port: 6379,
			host: '127.0.0.1',
			db: 'belrun'
		},
		mailer: {
			queue: {
				parallel: 10,
				attempts: 5,
				backoff: {type: 'exponential'},
				ttl: 60 * 1000
			},
			transport: {},
			mailDefaults: {}
		}
	}
});
