'use strict';

var configBuilder = require('./builder');

require('./common');

configBuilder.register({
	name: 'development',
	parent: 'common',
	config: {}
});
