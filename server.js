'use strict';

var express = require('express');
var fs = require('fs');

var app = express();

var html = fs.readFileSync('index.html');

app.get('/', function(req, res) {
	res.status(200);
	res.header('Content-Type', 'text/html');
	res.send(html);
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(port, host, function() {
	console.log('Listening on %s:%s', host, port);
});
