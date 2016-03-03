'use strict';

var configBuilder = require('./builder');
var stubTransport = require('nodemailer-stub-transport');

require('./common');

configBuilder.register({
	name: 'development',
	parent: 'common',
	config: {
		mailer: {
			transport: function() {
				return stubTransport();
			},
			mailDefaults: {
				from: 'BelRun Team <test@test.test>'
			}
		}
	}
});
