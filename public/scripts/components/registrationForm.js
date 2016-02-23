'use strict';

define(['jquery', 'helpers/ajax', 'helpers/validate'], function($, ajax, validate) {
	var createRegistration = function(raceId, data) {
		ajax.api({
			url: '/races/' + raceId + '/registrations',
			method: 'post',
			data: data,
			dataType: 'json',
			success: function() {

			}
		});
	};

	return function(options) {
		var $form = $(options.selector);

		validate($form);

		$form.on('submit', function(event) {
			event.preventDefault();

			createRegistration($form.data('raceId'), {
				email: $form.find('[name=email]').val(),
				name: $form.find('[name=name]').val()
			});
		});
	};
});
