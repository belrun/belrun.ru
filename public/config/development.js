'use strict';

requirejs.config({
	baseUrl: '/',
	paths: {
		// aliases
		components: 'scripts/components',
		helpers: 'scripts/helpers',
		views: 'scripts/views',
		// libs
		jquery: 'bower_components/jquery/dist/jquery',
		underscore: 'bower_components/underscore/underscore',
		bootstrap: 'bower_components/bootstrap/js',
		parsley: 'bower_components/parsleyjs/dist/parsley',
		fullpage: 'bower_components/fullpage.js/dist/jquery.fullpage',
		slimscroll: 'bower_components/jquery-slimscroll/jquery.slimscroll'
	},
	shim: {
		slimscroll: {
			deps: ['jquery']
		}
	}
});
