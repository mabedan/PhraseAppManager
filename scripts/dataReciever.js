
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
	emit: function (platformData, locale) {
		_.each(platformData.tags, function (tagData, tagName) {
			var commandText;
			commandText = 
				"pull " +
				" --tags=" + "PND-" + tagName + "-in-platform-" + platformName + 
				" --format=" + platformData.format +
				" --locale=" + locale
			;
			utils.phrase(commandText, function (res) {
				utils.dumpMessage(res, "pushing " + locale);
			});
		});
	}
};