#!/usr/bin/env node

var sass = require('node-sass');
var file = process.argv[2];
var outFile = file.substr(0, file.lastIndexOf(".")) + ".css";

sass.renderFile({
	"file": file,
	"success": function(css) { },
	"error": function(error){ throw new Error(error); },
	"outFile": outFile
});