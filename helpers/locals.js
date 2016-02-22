'use strict';

var moment = require('moment');
var config = require('../config');

moment.locale('ru');

module.exports = {
	moment: moment,
	config: config
};
