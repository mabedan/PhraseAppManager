var _ = require("lodash"),
	fs = require("fs"),
	stdio = require('stdio'),

	//own files	
	utils = require("./utils"),
	dataEmitter = require("./scripts/dataEmitter"),
	config = require("./config/config"),
	initialize = require("./scripts/initialize");

var ops = stdio.getopt({
    'push': {key: 'u', description: 'push the new keys to server'},
    'init': {key: 'i', args: 1, description: 'initiate the AppPhrase. pass the Auth Token as argument'}
});

if (!fs.existsSync("phraseData")) {
    fs.mkdir("phraseData");
}

if (ops.init) {
	initialize.execute(ops);
} else if (ops.push) {
	config.update();
	_.each(config.locales, function (locale) {
		_.each(config.platforms, function (platform) {
			dataEmitter.emit(platform, locale);
		});
	});
} else {	
	_.each(config.locales, function (locale) {
		_.each(config.platforms, function (platform) {
			dataEmitter.emit(platform, locale);
		});
	});
}

debugger;
