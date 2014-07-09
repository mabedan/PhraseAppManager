var _ = require("lodash"),
	glob = require("glob"),
	fs = require("fs"),
	colors = require("colors"),
	utils = require("../utils"),
	rimraf = require('rimraf');


/**
	phrase pull [LOCALE]
        --format=yml                 See documentation for list of allowed formats
        --target=./phrase/locales    Target folder to store locale files
        --tag=foo                    Limit results to a given tag instead of all translations
        --updated-since=YYYYMMDDHHMMSS
                                     Limit results to translations updated after the given date (UTC)
        --include-empty-translations Include empty translations in the result
        --convert-emoji              Convert Emoji symbols
        --secret=YOUR_AUTH_TOKEN     The Auth Token to use for this operation instead of the saved one (optional)

**/

module.exports = {
	receive: function (platformData, platformName, locale) {
		var tags = _.keys(platformData.tags);

		function reccursiveCall(tagIndex) {
			var tagName = tags[tagIndex], 
				tagData = platformData.tags[tagName],
				commandText,
				tmpFilePath;

			function callNext () {
				tagIndex++;
				if (tagIndex < tags.length) {
					reccursiveCall(tagIndex);	
				} else {
					rimraf("phraseData/tmp-"+locale, function () {});
				}
			}

			var destinationPath = platformData.path + "/" + tagData.destinationFolder.replace(/<locale>/g, locale).replace(/<format>/g, platformData.format);
			
			if (!fs.existsSync(destinationPath)) {	
				utils.verbosLog("Skipping pull data for "+ platformName+" in "+locale+" locale.");
				callNext();
				return;
			}

			utils.verbosLog("Starting to pull data for "+ platformName+" in "+locale+" locale.");

			tmpFilePath = "./tmp-"+locale+"/" + tagName + "-in-platform-" + platformName;
			
			commandText = 
				"pull " + locale +
				" --tag=" + "PND-" + tagName + "-in-platform-" + platformName + 
				" --target=" + tmpFilePath +
				" --format=" + platformData.format
			;

			function pullFromPhrase () {
				utils.phrase(commandText, function (res) {
					var foundFiles = glob.sync("phraseData/tmp-"+locale+"/**/*."+platformData.format);

					var newbuffer = fs.readFileSync(foundFiles[0]);

					utils.verbosLog("data delivered from PhraseApp");
					
					fs.writeFileSync(destinationPath, newbuffer);

					utils.verbosLog("Finished writing data for "+ platformName+" in "+locale+" locale.");

					callNext();
				});
			}

			if (fs.existsSync("phraseData/tmp-"+locale)) {
				rimraf("phraseData/tmp-"+locale, function () {
					pullFromPhrase();
				});
			} else {
				pullFromPhrase();
			}
		};

		reccursiveCall(0);
	}
};