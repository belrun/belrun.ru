'use strict';

define(['jquery', 'helpers/ajax', 'helpers/validation'], function($, ajax, validation) {
	var createRegistration = function(raceId, data) {
		ajax.api({
			url: '/races/' + raceId + '/registrations',
			method: 'post',
			data: data,
			dataType: 'json',
			success: function() {
				console.log('>>>>>>>>>>>> success')
			}
		});
	};

	return function(options) {
		var $form = $(options.selector);

		validation($form);

		$form.on('submit', function(event) {
			event.preventDefault();

			createRegistration($form.data('raceId'), {
				email: $form.find('[name=email]').val(),
				name: $form.find('[name=name]').val()
			});
		});
	};
});
