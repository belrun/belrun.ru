'use strict';

import $ from 'jquery';
import registrationForm from 'components/registrationForm.js';
import 'fullpage';
import 'slimscroll';

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
