'use strict';

var nodemailer = require('nodemailer');

var Mailer = module.exports = function(options) {
	this.options = options = options || {};

	this.transporter = nodemailer.createTransport(options);
};

Mailer.prototype.send = function(params, callback) {
	this.transporter.sendMail(params, callback);
};

