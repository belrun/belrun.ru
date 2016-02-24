'use strict';

exports.options = {
	changeDataMethods: ['findOneAndUpdate']
};

exports.init = function(collection) {
	collection.addPlugin('sequenceId');
	collection.addPlugin('createDate');
	collection.addPlugin('updateDate');
};
