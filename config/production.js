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
			port: env.OPENSHIFT_NODEJS_PORT,
			host: env.OPENSHIFT_NODEJS_IP
		},
		mongodb: {
			url: env.OPENSHIFT_MONGODB_DB_URL
		},
		redis: {
			port: env.REDISCLOUD_PORT,
			host: env.REDISCLOUD_HOSTNAME,
			auth: env.REDISCLOUD_PASSWORD,
			db: env.REDISCLOUD_DB
		},
		mailer: {
			transport: {
				service: 'Yandex',
				auth: {
					user: env.MAILER_USER,
					pass: env.MAILER_PASSWORD
				}
			},
			mailDefaults: {
				from: 'BelRun Team <' + env.MAILER_USER + '>'
			}
		}
	}
});
