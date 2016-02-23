'use strict';

exports.options = {
	changeDataMethods: ['insertOne']
};

exports.init = function(collection) {
	collection.addPlugin('sequenceId');
};
