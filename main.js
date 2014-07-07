	var _ = require("lodash"),
	CommandLine = require("CommandLine"),
	stdio = require('stdio');

var ops = stdio.getopt({
    'platforms': {key: 'p', args: 1, description: 'comma separated platforms to populate the translations to'},
    'tags': {key: 't', description: 'tags to populate. leave empty for all tags'},
    'push': {key: 'u', description: 'push the new keys to server'},
    'init': {key: 'i', description: 'initiate the AppPhrase'}
});
