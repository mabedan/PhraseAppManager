var fs = require("fs"),
	_ = require("lodash"),
	schema = require("js-schema");

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


var returnObject = {
	update : function () {
		var config = readJson("./config/config.json", "Config.json file should exist.");
		var localConfig = readJson("./config/localConfig.json");

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