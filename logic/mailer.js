'use strict';

var nodemailer = require('nodemailer');
var config = require('../config');

var transporter = nodemailer.createTransport(
	config.mailer.transport,
	config.mailer.defaults || {}
);

exports.sendMail = function(data, callback) {
	transporter.sendMail(data, callback);
};
