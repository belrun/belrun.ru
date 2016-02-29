'use strict';

System.config({
	baseURL: '/',
	transpiler: 'traceur',
	map: {
		// aliases
		components: 'scripts/components',
		helpers: 'scripts/helpers',
		views: 'scripts/views',
		// libs
		bootstrap: 'bower_components/bootstrap/js',
		fullpage: 'bower_components/fullpage.js/dist/jquery.fullpage.js',
		jquery: 'bower_components/jquery/dist/jquery.js',
		parsley: 'bower_components/parsleyjs/dist/parsley.js',
		slimscroll: 'bower_components/jquery-slimscroll/jquery.slimscroll.js',
		traceur: 'bower_components/traceur/traceur.js',
		underscore: 'bower_components/underscore/underscore.js'
	},
	meta: {
		'bootstrap/*': {
			format: 'amd'
		},
		fullpage: {
			format: 'amd'
		},
		jquery: {
			format: 'amd'
		},
		parsley: {
			format: 'amd'
		},
		slimscroll: {
			format: 'global',
			deps: ['jquery']
		},
		underscore: {
			format: 'amd'
		}
	}
});
