var _ = require("lodash"),
	fs = require("fs"),
	stdio = require('stdio'),

	//own files	
	utils = require("./utils"),
	dataEmitter = require("./scripts/dataEmitter"),
	dataReceiver = require("./scripts/dataReceiver"),
	config = require("./config/config"),
	initialize = require("./scripts/initialize");

var ops = stdio.getopt({
	"verbos" :  {key: 'v', description: 'verbos logging.'},
	'pull': {key: 'l', description: 'pulling the new values from server and replace existing values. Make sure to push first the new keys.'},
    'push': {key: 'u', description: 'push the new keys to server'},
    'force': {key: 'f', description: 'forcing the local translations onto the server values'},
    'init': {key: 'i', args: 1, description: 'initiate the AppPhrase. pass the Auth Token as argument'}
});

utils.verbos = ops.verbos;

if (!fs.existsSync("phraseData")) {
    fs.mkdir("phraseData");
}

if (ops.init) {
	initialize.execute(ops);
} else if (ops.push || ops.force) {
	pushAll(ops.force);
} else {	
	pullAll();
}

function pushAll (force) {
	config.update();
	_.each(config.locales, function (locale) {
		_.each(config.platforms, function (platform, platformName) {
			dataEmitter.emit(platform, platformName, locale, !!ops.force);
		});
	});
}

function pullAll () {
	config.update();
	_.each(config.locales, function (locale, localIndex) {
		_.each(config.platforms, function (platform, platformName) {
			dataReceiver.receive(platform, platformName, locale);
		});
	});
}

