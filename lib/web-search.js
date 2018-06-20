'use babel';

import WebSearchView from './web-search-view';
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
  },

  deactivate () {
    this.modalPanel.destroy();
    // this.subscriptions.dispose();
    this.webSearchView.destroy();
  },

  serialize () {
    return {
      webSearchViewState: this.webSearchView.serialize()
    };
  },

  toggle () {
    console.log('WebSearch was toggled!');
    return (
      true
    );
  }

};
