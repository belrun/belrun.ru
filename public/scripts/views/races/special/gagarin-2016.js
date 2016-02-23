'use strict';

define(['jquery', 'components/registrationForm', 'fullpage'], function($, registrationForm) {
	var $fullpage = $('#fullpage').fullpage({
		autoScrolling: false,
		fitToSection: false,
		verticalCentered: false
	});

	$('#letsgo-button').on('click', function() {
		var scrollX = window.scrollX;
		var scrollY = window.scrollY;

		$('#registration-form :input:first:visible').focus();

		window.scrollTo(scrollX, scrollY);

		$.fn.fullpage.moveSectionDown();
	});

	registrationForm({
		selector: '#registration-form'
	});
});
