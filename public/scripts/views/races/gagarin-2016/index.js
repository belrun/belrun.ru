'use strict';

define([
	'jquery', 'components/registrationForm', 'fullpage', 'slimscroll'
], function($, registrationForm) {
	$('#fullpage').fullpage({
		scrollOverflow: true,
		verticalCentered: false
	});

	$('#letsgo-button').on('click', function() {
		$.fn.fullpage.moveSectionDown();
	});

	registrationForm({
		selector: '#registration-form'
	});
});
