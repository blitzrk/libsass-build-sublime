#!/usr/bin/env node

// get required packages
var i, p, log;
var needsInstall = false;
var npm = require('npm');
npm.load({}, function(err, npm) {
	if(err) throw new Error(
		"Fatal error: This package requires Node.js and npm.\n" +
		"Be sure to set your NODE_PATH to the node_modules directory" +
		" where your globals and npm are installed."
	);
	npm.prefix = __dirname;

	// ignore default console output
	log = console.log;
	console.log = function() {};

	// check for not installed dependencies
	npm.commands.outdated([], function(err, data) {
		if(err) throw new Error(err);
		for(i=0; i<data.length; i++) {
			p = data[i];
			// check not installed or not the desired version
			if(!p[2] || p[2]!==p[3]) {
				log("Warning: Installing dependencies. This may take awhile.");
				needsInstall = true;
				npm.commands.install([], compileToSass);
				break;
			}
		}

		// reset console
		console.log = log;
		if(!needsInstall) compileToSass();
	});
});

function compileToSass(err, data) {
	if(err) throw new Error("Could not install packages:\n" + err);

	// load packages
	var fs = require('fs');
	var sass = require('node-sass');
	var path = require('path');
	var resolve = require('resolve');

	// get arguments
	var file = process.argv[2];
	var settingsPath = process.argv[3];

	// setup output and settings
	var outFile = file.substr(0, file.lastIndexOf(".")) + ".css";
	var settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8').replace(/\/\/.*|\n|\t/g,"").toString());
	var sassPaths = settings.includePaths.map(function(p) { return path.resolve('~', p) });

	// find Node packages to include
	settings.includePackages.forEach(function(m) {
		try {
			var res = resolve.sync(m, { basedir: process.cwd() });
			var paths = require(res).includePaths;
			if(!paths) throw new Error("Module " + m + " does not have an includePaths property.");
	    	sassPaths = sassPaths.concat(paths);
		} catch(err) {
			console.log("Warning: " + err.message.replace(/ from \'\/.*/,"."));
		}
	});

	// render CSS file
	sass.renderFile({
		"file": file,
		includePaths: sassPaths,
		"success": function(css) { },
		"error": function(error){ throw new Error(error); },
		"outFile": outFile
	});
}