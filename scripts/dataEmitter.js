var _ = require("lodash"),
	fs = require("fs"),
	utils = require("../utils");


/**
	phrase push FILE|DIRECTORY
        --tags=foo,bar               List of tags for phrase push (separated by comma)
    -R, --recursive                  Push files in subfolders as well (recursively)
        --locale=en                  Locale of the translations your file contain (required for formats that do not include the name of the locale in the file content)
        --format=yml                 See documentation for list of allowed formats
        --force-update-translations  Force update of existing translations with the file content
        --skip-unverification        When force updating translations, skip unverification of non-main locale translations
        --skip-upload-tags           Don't create upload tags automatically
        --convert-emoji              Convert Emojis to store and display them correctly in PhraseApp
        --secret=YOUR_AUTH_TOKEN     The Auth Token to use for this operation instead of the saved one (optional)
**/

module.exports = {
	emit: function (platformData, platformName, locale, force) {
		var tags = _.keys(platformData.tags);

		function reccursiveCall(tagIndex) {
			var tagName = tags[tagIndex], 
				tagData = platformData.tags[tagName],
				commandText;

			function callNext () {
				tagIndex++;
				if (tagIndex < tags.length) {
					reccursiveCall(tagIndex);
				}
			}
			
			path = 
				platformData.path + "/" + 
				tagData.destinationFolder
					.replace(/<locale>/g, locale.replace(/-/g, platformData.regionSeparator))
					.replace(/<format>/g, platformData.format);
			
			if (fs.existsSync(path)) {

				commandText = 
					"push ../" + path +
					" --tags=" + "PND-" + tagName + "-in-platform-" + platformName +
					" --format=" + platformData.format +
					" --locale=" + locale
				;

				if (force) {
					commandText+= " --force-update-translations";
				}

				utils.verbosLog("starting to push data for "+ platformName+" in "+locale+" locale.");

				utils.phrase(commandText, function (res) {
					utils.verbosLog("Finished pushinng data for "+ platformName+" in "+locale+" locale.");
					callNext();
				});

			} else {
				utils.verbosLog("Skipping pushing data for "+ platformName+" in "+locale+" locale.");
				callNext();
			}
		}
		reccursiveCall(0);
	}
};

