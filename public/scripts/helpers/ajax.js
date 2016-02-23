'use strict';

define(['jquery'], function($) {
	$.ajaxSetup({
		cache: false
	});

	var ajax = function(options) {
		return $.ajax(options);
	};

	ajax.api = function(options) {
		options.url = '/api/v1.0' + (options.url.charAt(0) === '/' ? '' : '/') + options.url;
		return ajax(options);
	};

	return ajax;
});
