'use strict';

var configBuilder = require('./builder');

var configName = process.env.NODE_ENV || 'development';

require('./' + configName);
module.exports = configBuilder.get(configName);

module.exports.configBuilder = configBuilder;
