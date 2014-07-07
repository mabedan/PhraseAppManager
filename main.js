var _ = require("lodash"),
	fs = require("fs"),
	CommandLine = require("node-CommandLine"),
	schema = require("js-schema"),
	stdio = require('stdio');
	_.mergeDefaults = require('merge-defaults');

var ops = stdio.getopt({
    'platforms': {key: 'p', args: 1, description: 'comma separated platforms to populate the translations to'},
    'tags': {key: 't', description: 'tags to populate. leave empty for all tags'},
    'push': {key: 'u', description: 'push the new keys to server'},
    'init': {key: 'i', description: 'initiate the AppPhrase'}
});

var configSchema = schema({
	platforms: {
		"*": schema({
			path: String,
			format: String,
			tags:{
				"*": {
					destinationFolder: /[\S]*<locale>[\S]*\.<format>/
				}	
			} 
		})
	},
	locales:Array.of(String)
});

function readJson (path, errorMessage) {
	var fileContent;
	try {
		return JSON.parse(fs.readFileSync(path, {encoding:"utf8"}));
	} catch (e) {
		if (errorMessage) {
			throw(new Error(errorMessage));
		} else {
			return null;
		}
	}
	
}

var config = readJson("./config.json", "Config.json file should exist.");
var localConfig = readJson("./localConfig.json");

if(!configSchema(config)) {
	throw(new Error("config file has invalide format"));
}

if (localConfig) {
	if (localConfig.platforms) {
		config.platforms = _.filter(config.platforms, function (platform, platformKey) {
			var newPath;
			if (localConfig.platforms[platformKey]) { 
				newPath = localConfig.platforms[platformKey].path;
				if (newPath) {
					platform.path = newPath;
				}
				return true;
			} else {
				return false;
			}
		});
	}
}


