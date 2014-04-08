var express = require('express');
var path = require('path');
var app = express();

// For post data
app.use(express.bodyParser());

// Serve static files
app.use(express.static(path.resolve(__dirname + '../../../')));

app.set('jsonp callback', true);

// Slow response so we can test aborting requests
app.all('/apps/slow', function(req, res) {
	var configs = JSON.parse(req.body.params);

	if (!configs) {
		configs = JSON.parse(req.params.params);
	}

	var context = configs[0].context || {};

	setTimeout(function() {
		res.json([{
			data: context,
			html: '<div></div>',
			inlineScripts: [],
			scripts: ['../tests/js/apps/' + configs[0].appId + '.js'],
			styles: []
		}]);
	}, 500);
});

// Single AppManifest in response
app.all('/apps/single', function(req, res) {
	var configs = JSON.parse(req.body.params);

	if (!configs) {
		configs = JSON.parse(req.params.params);
	}

	var context = configs[0].context || {};

	res.json([{
		data: context,
		html: '<div></div>',
		inlineScripts: [],
		scripts: ['../tests/js/apps/' + configs[0].appId + '.js'],
		styles: []
	}]);
});

// Try all sorts of script paths
app.all('/apps/paths', function(req, res) {
	var configs = JSON.parse(req.body.params);

	if (!configs) {
		configs = JSON.parse(req.params.params);
	}

	var context = configs[0].context || {};

	res.json([{
		data: context,
		html: '<div></div>',
		inlineScripts: [],
		scripts: [
			'../tests/js/apps/com_test_basic.js',
			'./tests/js/apps/com_test_basic.js',
			'//localhost:8080/tests/js/apps/com_test_basic.js'
		],
		styles: ['../tests/apps/css/com_test_basic.css']
	}]);
});

// Multiple AppManifests in response
app.all('/apps/multiple', function(req, res) {
	res.json([{
		data: {},
		html: '<div></div>',
		inlineScripts: [],
		scripts: ['../tests/js/apps/com_test_basic.js'],
		styles: []
	}, {
		data: {},
		html: '<div></div>',
		inlineScripts: [],
		scripts: ['../tests/js/apps/com_test_inherited.js'],
		styles: []
	}]);
});

// Duplicate AppManifests in response
app.all('/apps/duplicate', function(req, res) {
	var configs = JSON.parse(req.body.params);

	if (!configs) {
		configs = JSON.parse(req.params.params);
	}

	res.json([{
		data: {},
		html: '<div></div>',
		inlineScripts: [],
		scripts: ['../tests/js/apps/' + configs[0].appId + '.js'],
		styles: []
	}, {
		data: {},
		html: '<div></div>',
		inlineScripts: [],
		scripts: ['../tests/js/apps/' + configs[0].appId + '.js'],
		styles: []
	}]);
});

// Single AppManifests over jsonp
app.all('/apps/single_jsonp', function(req, res) {
	res.jsonp([{
		data: {},
		html: '<div></div>',
		inlineScripts: [],
		scripts: ['../tests/js/apps/com_test_basic.js'],
		styles: []
	}]);
});

// Simulate a slow jsonp call
app.all('/apps/single_jsonp_slow', function(req, res) {
	setTimeout(function() {
		res.jsonp([{
			data: {},
			html: '<div></div>',
			inlineScripts: [],
			scripts: ['../tests/js/apps/com_test_basic.js'],
			styles: []
		}]);
	}, 500);
});

// Simulate a data app
app.all('/apps/data_app', function(req, res) {
	res.json([{
		data: {},
		inlineScripts: [],
		scripts: ['../tests/js/apps/com_test_basic.js'],
		styles: []
	}]);
});

// Force an error
app.all('/apps/error', function(req, res) {
	res.send(500, 'Uh oh!');
});

// export the module for use with grunt
module.exports = app;
