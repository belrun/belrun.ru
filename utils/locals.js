'use strict';

var moment = require('moment');
var _ = require('underscore');
var config = require('../config');

moment.locale('ru');

module.exports = {
	moment: moment,
	_: _,
	config: config
};
