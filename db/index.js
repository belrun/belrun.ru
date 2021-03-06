'use strict';

var MongoClient = require('mongodb').MongoClient;
var Steppy = require('twostep').Steppy;
var _ = require('underscore');
var Collection = require('mongodbext').Collection;

var collections = {};

var collectionNames = ['races', 'participants'];

_(collectionNames).each(function(name) {
	try {
		collections[name] = require('./' + name);
	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			console.warn('Collection "%s" initialized with default options', name);
			collections[name] = {};
		} else {
			throw err;
		}
	}
});

var createCollections = function(db) {
	_(collections).each(function(collection, name) {
		exports[name] = new Collection(db, name, collection.options);
	});
};

var initCollections = function() {
	_(collections).each(function(collection, name) {
		if (collection.init) {
			collection.init(exports[name]);
		}
	});
};

exports.init = function(options, callback) {
	if (exports.db) return callback();

	Steppy(
		function() {
			MongoClient.connect(options.url, this.slot());
		},
		function(err, db) {
			exports.db = db;

			createCollections(db);

			initCollections(db);

			this.pass(null);
		},
		function() {
			console.log('Connection to mongodb is established');

			this.pass(null);
		},
		callback
	);
};
