'use strict';

import $ from 'jquery';
import * as ajax from 'helpers/ajax.js';
import validate from 'helpers/validate.js';

export default function(options) {
	var $form = $(options.selector);

	validate($form);

	var $result = $form.find('.js-result');

	$form.on('submit', function(event) {
		event.preventDefault();

		var raceId = $form.data('raceId');

		var data = {
			email: $form.find('[name=email]').val(),
			firstName: $form.find('[name=firstName]').val(),
			lastName: $form.find('[name=lastName]').val()
		};

		ajax.api({
			url: '/races/' + raceId + '/participants',
			method: 'post',
			data: data,
			dataType: 'json',
			success: function(data) {
				$result.html(
					'<div class="alert alert-success">' +
						'Успешная регистрация! Ваш номер: ' + data.participant.number +
					'</div>'
				);
			},
			error: function() {
				$result.html(
					'<div class="alert alert-danger">При регистрации произошла ошибка</div>'
				);
			}
		});
	});
}
