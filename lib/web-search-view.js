'use babel';

export default class WebSearchView {

  constructor (serializedState) {
    // Create root element
    atom.config.onDidChange('web-search.sitesJson', () => promptUserReloadAtom());
    this.element = document.createElement('div');
    this.element.id = 'myFuckingIdOfThePlugin';
    this.element.style.overflowX = 'scroll';
    this.element.style.overflowY = 'hidden';
    JSON.parse(atom.config.get('web-search').sitesJson).forEach(a => {
      const div = document.createElement('div');
      const aTag = document.createElement('a');
      const favicon = document.createElement('div');
      favicon.style.float = 'left';
      favicon.style.width = '16px';
      favicon.style.height = '16px';
      favicon.style.marginRight = '4px';
      favicon.style.background = 'url(https://plus.google.com/_/favicon?domain=' + a.url + ')';
      aTag.href = a.url;
      aTag.target = '_blank';
      aTag.style.color = 'white';
      aTag.appendChild(favicon);
      aTag.appendChild(document.createTextNode(a.title));
      div.appendChild(aTag);
      div.style.float = 'left';
      div.style.paddingTop = '3px';
      div.style.paddingLeft = '5px';
      div.style.paddingRight = '5px';
      div.style.paddingBottom = '3px';
      div.title = a.url.split('://')[1];
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

const promptUserReloadAtom = (msg = 'Reload `web-search` to apply changes') => {
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
