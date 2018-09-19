'use babel';

import WebSearchView from './dertyp7214-web-search-view';
import { CompositeDisposable } from 'atom';
import $ from 'jquery';
var fs = require('fs');

export default {

  webSearchView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
    this.subscriptions = new CompositeDisposable();
    this.webSearchView = new WebSearchView(state.webSearchViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.webSearchView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable

    // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'web-search:toggle': () => this.toggle()
    // }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dertyp7214-web-search:upperCase': () => this.upperCase(),
      'dertyp7214-web-search:lowerCase': () => this.lowerCase(),
      'dertyp7214-web-search:searchModules': () => this.searchModules(),
      'dertyp7214-web-search:createModuleJSON': () => this.createModuleJSON(),
      'dertyp7214-web-search:putUrlInEnvLocal': () => this.putUrlInEnv('Local'),
      'dertyp7214-web-search:putUrlInEnvPublic': () => this.putUrlInEnv('Public'),
      'dertyp7214-web-search:putUrlInEnvClean': () => this.putUrlInEnv('Clean'),
      'dertyp7214-web-search:putCustomReplacement': () => this.putCustomReplacement('Filled'),
      'dertyp7214-web-search:putCleanCustomReplacement': () => this.putCustomReplacement('Clean'),
      'dertyp7214-web-search:cleanUpJSON': () => this.cleanUpJSON(),
      'dertyp7214-web-search:copyIBAN': () => this.copyIBAN()
    }));
  },

  deactivate () {
    this.modalPanel.destroy();
    his.subscriptions.dispose();
    this.webSearchView.destroy();
  },

  serialize () {
    return {
      webSearchViewState: this.webSearchView.serialize()
    };
  },

  upperCase () {
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      editor.insertText(selection.toUpperCase());
    }
  },

  lowerCase () {
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText();
      editor.insertText(selection.toLowerCase());
    }
  },

  searchModules () {
    if (editor = atom.workspace.getActiveTextEditor()) {
      let filename = editor.getFileName();
      try {
        if (filename === 'package.json') {
          const json = JSON.parse(editor.getText());
          const dependencies = json.dependencies;
          for (var dependencie in dependencies) {
            const a = document.createElement('a');
            a.id = dependencie + '_id';
            a.href = 'http://www.npmjs.com/' + dependencie;
            document.getElementsByTagName('html')[0].appendChild(a);
            document.getElementById(dependencie + '_id').click();
            a.remove();
          }
        }
      } catch (error) {
        atom.notifications.addError('ERROR: "' + error + '" on `Web Search (sarchModules)`');
      }
    }
  },

  createModuleJSON () {
    if (editor = atom.workspace.getActiveTextEditor()) {
      let filename = editor.getFileName();
      var dependencieJSON = [];
      try {
        if (filename === 'package.json') {
          const json = JSON.parse(editor.getText());
          const dependencies = json.dependencies;
          for (var keys = Object.keys(dependencies), i = 0, end = keys.length; i < end; i++) {
            var dependencie = keys[i];
            var last = keys[keys.length - 1];
            dependencieJSON.push({name: dependencie, npmUrl: 'http://www.npmjs.com/' + dependencie});
            if (dependencie === last) {
              fallbackCopyTextToClipboard(JSON.stringify(dependencieJSON));
              atom.notifications.addInfo('Copied: JSON from `' + filename + '`');
            }
          }
        }
      } catch (error) {
        atom.notifications.addError('ERROR: "' + error + '" on `Web Search (sarchModules)`');
      }
    }
  },

  putCustomReplacement (type) {
    const json = JSON.parse(readSettings());
    if (editor = atom.workspace.getActiveTextEditor()) {
      try {
        const contentJson = JSON.parse(editor.getText());
        const cursorPos = editor.getCursorBufferPosition();
        for (i = 0, end = json.replacements.length; i < end; i++) {
          const obj = json.replacements[i];
          console.log('Object #' + i, obj, '\n', end);
          const filename = editor.getFileName();
          if (filename === obj.file) {
            try {
              let object = contentJson;
              const paths = [];
              console.log('PATH: ', obj.path.split('/'));
              if (obj.path.split('/')[0] !== '') {
                console.log('IF');
                for (y = 0, end = obj.path.split('/').length; y < end; y++) {
                  const split = obj.path.split('/')[y];
                  object = object[split];
                  paths.push(split);
                }
                object[obj.key] = type === 'Clean' ? obj.clean : obj.filled;
                let newObj = {};
                for (y = paths.length, end = 0; y > end; y--) {
                  newObj = JSON.parse('{"' + paths[y - 1] + '": ' + JSON.stringify(Object.keys(newObj).length > 0 ? newObj : object) + '}');
                }
                // $.extend(contentJson, newObj);
              } else {
                console.log('ELSE');
                contentJson[obj.key] = type === 'Clean' ? obj.clean : obj.filled;
              }
              console.log('Finished Object #' + i, contentJson);
            } catch (error) {
              console.log(error);
            }
          }
        }
        editor.setText(JSON.stringify(contentJson, null, 2));
        editor.save();
        editor.setCursorBufferPosition(cursorPos);
        console.log('Finished', json);
      } catch (error) {
        console.log('ERROR', error);
      }
    }
  },

  putUrlInEnv (type) {
    const envUrl = atom.config.get('DerTyp7214-Web-Search')['envUrl' + type];
    if (editor = atom.workspace.getActiveTextEditor()) {
      const cursorPos = editor.getCursorBufferPosition();
      const filename = editor.getFileName();
      if (filename === 'env.json') {
        try {
          const json = JSON.parse(editor.getText());
          json.host = envUrl;
          editor.setText(JSON.stringify(json, null, 2));
          editor.save();
          editor.setCursorBufferPosition(cursorPos);
        } catch (error) {
          atom.notifications.addError('ERROR: "' + error + '" on `Web Search (putUrlInEnv)`');
        }
      } else {
        atom.notifications.addInfo('Youre not in `env.json`');
      }
    }
  },

  cleanUpJSON () {
    if (editor = atom.workspace.getActiveTextEditor()) {
      const json = editor.getSelectedText();
      try {
        editor.insertText(JSON.stringify(JSON.parse(json), null, 2));
      } catch (error) {
        try {
          editor.insertText(JSON.parse(JSON.stringify(json, null, 2)));
        } catch (error) {
          atom.notifications.addError('ERROR: selection is not a `JSON`');
        }
      }
    }
  },

  copyIBAN () {
    const ibans = ['DE27100777770209299700', 'DE11520513735120710131'];
    const IBAN = ibans[Math.floor(Math.random() * ibans.length)];
    fallbackCopyTextToClipboard(IBAN);
    atom.notifications.addSuccess('Copied IBAN: `' + IBAN + '`');
  }
};

function fallbackCopyTextToClipboard (text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function writeSettings (json) {
  fs.writeFile(require('os').homedir() + '/.atom/dertyp7214-web-search-settings.json', json, function (err) {
    if (err) throw err;
  });
}

function readSettings () {
  try {
    const settings = fs.readFileSync(require('os').homedir() + '/.atom/dertyp7214-web-search-settings.json', 'utf8');
    if (settings.length < 2) throw new Error('Error');
    return settings;
  } catch (error) {
    writeSettings('{\r\n  "replacements":\r\n    [{\r\n      "file": "env.json",\r\n      "path": "testObj/testObj2",\r\n      "key": "test",\r\n      "clean": "empty",\r\n      "filled": "filled"\r\n    }]\r\n}\r\n');
    atom.workspace.open(require('os').homedir() + '/.atom/dertyp7214-web-search-settings.json', {});
    return '{}';
  }
}
