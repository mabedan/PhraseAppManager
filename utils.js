var _s = require("underscore.string"),
 	sys = require('sys'),
	exec = require('child_process').exec;

module.exports = {
	dumpMessage : function (str, title) {
		title = title ? " "+title+" " : "";

		var dashesLength = (process.stdout.columns - title.length - 2) / 4;
		console.log(" ");
		console.log(_s.repeat("{ ", dashesLength) + title);
		console.log(str);
		console.log(_s.repeat("  ", dashesLength) + title + _s.repeat("} ", dashesLength));
		console.log(" ");
	},
	phrase : function (msg, cb, fullCallback) {
		exec("phrase "+msg, { cwd: 'phraseData' }, fullCallback ? cb : function (error, stdout, stderr) {cb(stdout)});
	}
};
