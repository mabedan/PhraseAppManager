var fs = require("fs"),
	utils = require("../utils"),
	_ = require("lodash"),
	schema = require("js-schema");

var configSchema = schema({
	platforms: {
		"*": schema({
			regionSeparator:String,
			path: String,
			format: String,
			tags:{
				"*": {
					destinationFile: /[\S]*<locale>[\S]*\.<format>/
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


var returnObject = {
	update : function () {
		var config = readJson("./config/projectConfig.json", "projectConfig.json file should exist.");
		var localConfig = readJson("./config/userConfig.json");

		if(!configSchema(config)) {
			utils.verbosLog(JSON.stringify(config, null, 2));
			throw(new Error("projectConfig.json file has invalide format"));
		}

		if (localConfig) {
			if (localConfig.platforms) {
				_.each(_.keys(config.platforms), function (platformKey) {
					var newPath;
					if (localConfig.platforms[platformKey]) { 
						newPath = localConfig.platforms[platformKey].path;
						if (newPath) {
							config.platforms[platformKey].path = newPath;
						}
					} else {
						delete config.platforms[platformKey];
					}
				});
				_.each(localConfig.platforms, function (platform, platformKey) {
					if (!config[platformKey]) {
						config[platformKey] = platform;
					}
				});
			}
		}

		returnObject.platforms = config.platforms;
		returnObject.locales = config.locales;
	},
	platforms : {},
	locales : []
};

module.exports = returnObject;