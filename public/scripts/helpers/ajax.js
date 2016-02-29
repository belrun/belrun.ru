'use strict';

import $ from 'jquery';

$.ajaxSetup({
	cache: false
});

export default function ajax(options) {
	return $.ajax(options);
}

export function api(options) {
	options.url = '/api/v1.0' + (options.url.charAt(0) === '/' ? '' : '/') + options.url;
	return ajax(options);
}
