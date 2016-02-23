'use strict';

define(['jquery', 'underscore', 'parsley'], function($, _) {
	return function(selector, options) {
		var $selector = $(selector);

		return $selector.parsley(_.defaults({}, options, {
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
		}));
	};
});
