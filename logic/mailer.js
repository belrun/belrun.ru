'use strict';

var nodemailer = require('nodemailer');
var _ = require('underscore');
var kue = require('kue');
var Steppy = require('twostep').Steppy;
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;
var config = require('../config');
var locals = require('../helpers/locals');

var titleRegExp = /<title>(.+)<\/title>/i;

// initialize nodemailer transport
var transporter = nodemailer.createTransport(
	config.mailer.transport,
	config.mailer.mailDefaults || {}
);

var queueOptions = config.mailer.queue;

// initialize queue
var queue = kue.createQueue({
	redis: config.redis
});

queue.process('email', queueOptions.parallel, function(job, done) {
	var data = job.data;

	Steppy(
		function() {
			if (data.template) {
				// render html and text
				var emailTemplate = new EmailTemplate(
					path.join(config.paths.mailerViews, data.template)
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
		done
	);
});

exports.sendMail = function(data, callback) {
	// put email to queue
	queue.create('email', data)
		.attempts(queueOptions.attempts)
		.backoff(queueOptions.backoff)
		.ttl(queueOptions.ttl)
		.save(callback);
};

exports.queueApp = kue.app;
