'use strict';

import $ from 'jquery';
import _ from 'underscore';
import 'parsley';

export default function(selector, options) {
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
}
