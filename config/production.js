'use strict';

var configBuilder = require('./builder');

require('./common');

var env = process.env;

configBuilder.register({
	name: 'production',
	parent: 'common',
	config: {
		env: 'production',
		listen: {
			port: env.NODE_PORT,
			host: env.NODE_IP
		},
		mongodb: {
			url: function(config) {
				return env.MONGODB_URL + config.mongodb.dbName;
			}
		},
		mq: {
			user: env.CLOUDAMQP_USER,
			pass: env.CLOUDAMQP_PASS,
			server: env.CLOUDAMQP_SERVER,
			port: env.CLOUDAMQP_PORT,
			vhost: env.CLOUDAMQP_VHOST
		},
		sender: {
			transport: {
				service: env.SENDER_SERVICE,
				auth: {
					user: env.SENDER_USER,
					pass: env.SENDER_PASS
				}
			},
			defaults: {
				from: 'BelRun Team <' + env.SENDER_USER + '>'
			}
		}
	}
});
