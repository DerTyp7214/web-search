'use babel';

import WebSearchView from './dertyp7214-web-search-view';
import { CompositeDisposable } from 'atom';

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
      'dertyp7214-web-search:putUrlInEnv': () => this.putUrlInEnv()
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

  putUrlInEnv () {
    const envUrl = atom.config.get('dertyp7214-web-search').envUrl;
    if (editor = atom.workspace.getActiveTextEditor()) {
      const filename = editor.getFileName();
      if (filename === 'env.json') {
        try {
          const json = JSON.parse(editor.getText());
          json.host = envUrl;
          editor.setText(JSON.stringify(json, null, 1));
          editor.save();
        } catch (error) {
          atom.notifications.addError('ERROR: "' + error + '" on `Web Search (putUrlInEnv)`');
        }
      }
    }
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
