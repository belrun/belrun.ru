'use strict';

var Steppy = require('twostep').Steppy;
var moment = require('moment');
var _ = require('underscore');
var db = require('../../db');
var mailer = require('../mailer');

module.exports = {
	enabled: true,
	cronTime: '0 0 12 * * *',
	onTick: function(callback) {
		Steppy(
			function() {
				// get tomorrow races
				db.races
					.find({
						date: {
							$gte: moment().add(1, 'days').startOf('day').valueOf(),
							$lte: moment().add(1, 'days').endOf('day').valueOf()
						},
						registration: {$exists: true}
					})
					.sort({date: 1})
					.toArray(this.slot());

				// get after week races
				db.races
					.find({
						date: {
							$gte: moment().add(1, 'weeks').startOf('day').valueOf(),
							$lte: moment().add(1, 'weeks').endOf('day').valueOf()
						},
						registration: {$exists: true}
					})
					.sort({date: 1})
					.toArray(this.slot());
			},
			function(err, tomorrowRaces, afterWeekRaces) {
				this.pass(tomorrowRaces, afterWeekRaces);

				// get tomorrow participants
				if (tomorrowRaces.length) {
					db.participants
						.find({
							'race._id': {$in: _(tomorrowRaces).pluck('_id')}
						})
						.toArray(this.slot());
				} else {
					this.pass([]);
				}

				// get after week participants
				if (afterWeekRaces.length) {
					db.participants
						.find({
							'race._id': {$in: _(afterWeekRaces).pluck('_id')}
						})
						.toArray(this.slot());
				} else {
					this.pass([]);
				}
			},
			function(err, tomorrowRaces, afterWeekRaces, tomorrowParticipants, afterWeekParticipants) {
				this.pass(null);

				// send tomorrow emails
				if (tomorrowParticipants.length) {
					var tomorrowRacesHash = _(tomorrowRaces).indexBy('_id');

					var tomorrowGroup = this.makeGroup();
					_(tomorrowParticipants).each(function(participant) {
						mailer.queue({
							template: 'notifications/tomorrow',
							locals: {race: tomorrowRacesHash[participant.race._id]},
							to: participant.email
						}, tomorrowGroup.slot());
					});
				}

				// send after week emails
				if (afterWeekParticipants.length) {
					var afterWeekRacesHash = _(afterWeekRaces).indexBy('_id');

					var afterWeekGroup = this.makeGroup();
					_(afterWeekParticipants).each(function(participant) {
						mailer.queue({
							template: 'notifications/afterWeek',
							locals: {race: afterWeekRacesHash[participant.race._id]},
							to: participant.email
						}, afterWeekGroup.slot());
					});
				}
			},
			callback
		);
	}
};
