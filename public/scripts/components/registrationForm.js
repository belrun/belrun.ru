'use strict';

define(['jquery', 'parsley'], function($) {
	return function(options) {
		var $form = $(options.selector);

		$form.parsley({
			errorClass: 'has-error',
			successClass: 'has-success',
			classHandler: function (ParsleyField) {
				return ParsleyField.$element.parents('.form-group');
			},
			errorsContainer: function (ParsleyField) {
				return ParsleyField.$element.parents('.form-group');
			},
			errorsWrapper: '<span class="help-block">',
			errorTemplate: '<div></div>'
		});

		$form.on('submit', function(event) {
			event.preventDefault();

		});
	};
});
