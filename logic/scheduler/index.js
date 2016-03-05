'use strict';

var _ = require('underscore');
var Steppy = require('twostep').Steppy;
var CronJob = require('cron').CronJob;

var jobNames = ['sendNotifications'];

var jobs = _(jobNames)
	.chain()
	.map(function(jobName) {
		var params = require('./jobs/' + jobName);

		// skip job if it is not enabled
		if (!params.enabled) {
			return null;
		}

		// wrap job "onTick" method to log start end end of job
		var onTick = function() {
			Steppy(
				function() {
					console.log('Cron job "%s" started', jobName);

					params.onTick(this.slot());
				},
				function(err) {
					if (err) {
						console.error('Cron job "%s" failed with error:\n%s', jobName, err.stack);
					} else {
						console.log('Cron job "%s" completed', jobName);
					}
				}
			);
		};

		// create CronJob instances with {start: false} option, start them lated by "init" call
		return new CronJob({
			start: false,
			cronTime: params.cronTime,
			onTick: onTick
		});
	})
	.compact()
	.value();

exports.jobs = jobs;

exports.start = function() {
	_(jobs).each(function(job) {
		job.start();
	});
};

exports.stop = function() {
	_(jobs).each(function(job) {
		job.stop();
	});
};
