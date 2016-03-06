'use strict';

var nodemailer = require('nodemailer');
var _ = require('underscore');
var Steppy = require('twostep').Steppy;
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var config = require('../config');
var locals = require('../utils/locals');

// regexp to parse subject from html
var titleRegExp = /<title>(.+)<\/title>/i;

var transport = config.sender.transport;
var defaults = config.sender.defaults || {};

// create stub transport instance (only for development)
if (transport === 'stub') {
	var createStubTransport = require('nodemailer-stub-transport');

	transport = createStubTransport();

	transport.on('end', function(info) {
		console.log(
			'[Stub transport] Mail sent:\n  envelope: %j\n  messageId: %s\n  response: %s',
			info.envelope,
			info.messageId,
			info.response.toString().replace(/\n/g, '\n' + Array(13).join(' '))
		);
	});
}

// initialize nodemailer transport
var transporter = nodemailer.createTransport(transport, defaults);

exports.sendMail = function(data, callback) {
	Steppy(
		function() {
			if (data.template) {
				// render html and text
				var emailTemplate = new EmailTemplate(
					path.join(config.paths.senderTemplates, data.template)
				);

				// render template with merged locals
				emailTemplate.render(_.defaults({}, locals, data.locals), this.slot());
			} else {
				this.pass(null);
			}
		},
		function(err, renderResult) {
			// merge result with data if template was rendered
			if (renderResult) {
				data = _(data)
					.chain()
					.omit('template', 'locals')
					.extend(renderResult)
					.value();
			}

			// get subject from html <title> tag if it is omitted in data
			if (_.isUndefined(data.subject) && data.html) {
				var titleMatch = data.html.match(titleRegExp);

				if (titleMatch) {
					data.subject = titleMatch[1];
				}
			}

			// send email via nodemailer transport
			transporter.sendMail(data, this.slot());
		},
		callback
	);
};
