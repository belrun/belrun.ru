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
			senderTemplates: function(config) {
				return path.join(config.paths.views, 'sender');
			}
		},
		mongodb: {
			dbName: 'belrun',
			url: function(config) {
				return 'mongodb://127.0.0.1:27017/' + config.mongodb.dbName;
			}
		},
		mq: {
			user: 'guest',
			pass: 'guest',
			server: '127.0.0.1',
			port: 5672
		},
		sender: {
			transport: {},
			defaults: {}
		}
	}
});
