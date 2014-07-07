
var utils = require("../utils");

var child;

module.exports = {
	execute: function (ops) {
		var secret = ops.init;
		if (secret) {
			utils.phrase("init --secret=" + secret, function (res) {
				utils.dumpMessage(res, "Initializing");
			});
		} else {
			utils.dumpMessage("You need to provide the auth token for initializing");
		}
	}
};
