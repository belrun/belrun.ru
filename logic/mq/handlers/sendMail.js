'use strict';

var wascally = require('wascally');
var Steppy = require('twostep').Steppy;
var sender = require('../../sender');

// initialize handlers first
var handler = wascally.handle('sender.sendMail', function(msg) {
	Steppy(
		function() {
			sender.sendMail(msg.body, this.slot());
		},
		function(err) {
			if (err) throw err;

			msg.ack();
		}
	);
});

handler.catch(function(err, msg) {
	console.error('Error in MQ "sendMail" handler:', err.stack);
	msg.reject();
});
