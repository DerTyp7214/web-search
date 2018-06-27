'use babel';

import WebSearchView from './dertyp7214-web-search-view';
import { CompositeDisposable } from 'atom';

export default {

  webSearchView: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {
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
      'dertyp7214-web-search:lowerCase': () => this.lowerCase()
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
  }

};
