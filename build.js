#!/usr/bin/env node

var fs = require('fs');
var sass = require('node-sass');
var path = require('path');
var resolve = require('resolve');

var file = process.argv[2];
var settingsPath = process.argv[3];

var outFile = file.substr(0, file.lastIndexOf(".")) + ".css";
var settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8').replace(/\/\/.*|\n|\t/g,"").toString());
var sassPaths = settings.includePaths.map(function(p) { return path.resolve('~', p) });

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

sass.renderFile({
	"file": file,
	includePaths: sassPaths,
	"success": function(css) { },
	"error": function(error){ throw new Error(error); },
	"outFile": outFile
});