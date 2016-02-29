'use strict';

var configBuilder = require('./builder');

require('./common');

configBuilder.register({
	name: 'development',
	parent: 'common',
	config: {
		mailer: {
			transport: {
				debug: true,
				logger: true,
				service: 'Yandex',
				auth: {
					user: 'test',
					pass: 'test'
				}
			}
		}
	}
});
