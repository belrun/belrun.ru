'use strict';

exports.options = {
	changeDataMethods: []
};

exports.init = function(collection) {
	collection.addPlugin('sequenceId');
};
