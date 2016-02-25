'use strict';

var configBuilder = require('./builder');

require('./development');

configBuilder.register({
	name: 'developmentExt',
	parent: 'common',
	config: {
		listen: {
			host: '0.0.0.0',
			port: 32156
		}
	}
});
