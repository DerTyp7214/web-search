'use babel';

let $ = require('jquery');

export default class WebSearchView {

  constructor (serializedState) {
    // Create root element
    atom.config.onDidChange('dertyp7214-web-search.sitesJson', () => promptUserReloadAtom());
    this.element = document.createElement('div');
    this.element.id = 'myFuckingIdOfThePlugin';
    this.element.style.overflow = 'hidden';
    atom.config.get('dertyp7214-web-search').sitesJson.split(', ').forEach(a => {
      const div = document.createElement('div');
      const aTag = document.createElement('a');
      const favicon = document.createElement('div');
      favicon.style.float = 'left';
      favicon.style.width = '16px';
      favicon.style.height = '16px';
      favicon.style.marginRight = '4px';
      favicon.style.background = 'url(https://plus.google.com/_/favicon?domain=' + a + ')';
      aTag.href = a.url;
      aTag.target = '_blank';
      aTag.style.color = 'white';
      aTag.appendChild(favicon);
      if (a.startsWith('github')) {
        aTag.appendChild(document.createTextNode('GitHub'));
      } else if (a.startsWith('stackoverflow')) {
        aTag.appendChild(document.createTextNode('Stack Overflow'));
      }
      $.ajax({
        url: 'http://textance.herokuapp.com/title/' + a,
        complete: function (data) {
          aTag.appendChild(document.createTextNode(data.responseText));
        }
      });
      div.appendChild(aTag);
      div.style.float = 'left';
      div.style.paddingTop = '3px';
      div.style.paddingLeft = '5px';
      div.style.paddingRight = '5px';
      div.style.paddingBottom = '3px';
      div.title = a;
      this.element.appendChild(div);
    });
    const atomWorkspaceAxis = document.getElementsByTagName('atom-workspace-axis')[0];
    const atomDock = atomWorkspaceAxis.getElementsByClassName('left')[0]
      .getElementsByTagName('atom-dock')[0];
    const pane = atomDock.getElementsByTagName('div')[0].getElementsByTagName('atom-pane')[0];
    pane.insertBefore(this.element, pane.childNodes[1]);
  }

  // Returns an object that can be retrieved when package is activated
  serialize () {}

  // Tear down any state and detach
  destroy () {
    document.getElementById('myFuckingIdOfThePlugin').remove();
  }

  getElement () {
    return document.createElement('div');
  }
}

const promptUserReloadAtom = (msg = 'Reload `dertyp7214-web-search` to apply changes') => {
  const buttons = [{
    text: 'Reload',
    onDidClick: () => atom.reload()
  }];
  atom.notifications.addInfo(
    msg,
    {
      buttons,
      dismissable: true
    }
  );
};
