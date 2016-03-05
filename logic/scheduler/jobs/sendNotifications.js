'use strict';

var Steppy = require('twostep').Steppy;
var moment = require('moment');
var _ = require('underscore');
var db = require('../../../db');
var mq = require('../../mq');

var sendNotifications = function(params, callback) {
	Steppy(
		function() {
			db.races
				.find({
					date: {
						$gte: params.beginDate,
						$lte: params.endDate
					},
					registration: {$exists: true}
				})
				.sort({date: 1})
				.toArray(this.slot());
		},
		function(err, races) {
			this.pass(races);

			if (races.length) {
				db.participants
					.find({'race._id': {$in: _(races).pluck('_id')}})
					.toArray(this.slot());
			} else {
				this.pass([]);
			}
		},
		function(err, races, participants) {
			if (participants.length) {
				var racesHash = _(races).indexBy('_id');
				var group = this.makeGroup();

				_(participants).each(function(participant) {
					mq.publish('sender', {
						type: 'sender.sendMail',
						body: {
							template: 'notifications/' + params.type,
							locals: {race: racesHash[participant.race._id]},
							to: participant.email
						}
					}, group.slot());
				});
			} else {
				this.pass(null);
			}
		},
		callback
	);
};

module.exports = {
	enabled: true,
	cronTime: '0 0 12 * * *',
	onTick: function(callback) {
		Steppy(
			function() {
				// send tomorrow notifications
				sendNotifications({
					type: 'tomorrow',
					beginDate: moment().add(1, 'days').startOf('day').valueOf(),
					endDate: moment().add(1, 'days').endOf('day').valueOf()
				}, this.slot());

				// send after week notifications
				sendNotifications({
					type: 'afterWeek',
					beginDate: moment().add(1, 'weeks').startOf('day').valueOf(),
					endDate: moment().add(1, 'weeks').endOf('day').valueOf()
				}, this.slot());
			},
			callback
		);
	}
};
