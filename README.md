#AppPhrase Manager

Use this tool to populate AppPhrase data into different platforms in order to use the same keys accross platforms. PhraseAppManager functions with all the formats supported by PhraseApp. 

You can Manage as many projects as you have, and have different affected files for each projects (ex. different destinations for `storyboard` strings and normal localization strings in an iOS Project).

---

###Getting started

Create config.json file and insert information about your different projects and different locals. Refer to `projectConfig.json.example` for more information.

###Connecting to PhraseApp server

Find your Auth key in PhraseApp project settings, and use it in this command.

    node main.js -i <YOUR AUTH KEY HERE>

###Pulling info from PhraseApp into local projects

This operation will _replace all existing localization files_ using the info from PhraseApp

    node main.js -l
    
We have decided to let the merge happen in the cloud. Once you push your local changes, and pull again, you will received the merged information.
    
###Pushing new keys to PhraseApp info into local projects

This will post the _new_ key/values found in your localization files. The next time you pull, translations will go to the right destinations as specified in the config file.
    
    node main.js -u
    
In order to force the translation for existing keys in PhraseApp, use the `-f` flag instead of `-u`

---

At any point you can use `node main.js --help` for instructions.

`node main.js -v` will execute your operation in verbos mpde.
