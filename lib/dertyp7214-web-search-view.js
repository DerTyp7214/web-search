'use babel';

let $ = require('jquery');

export default class WebSearchView {

  constructor (serializedState) {
    // Create root element
    // atom.config.onDidChange('editor:newline', 'dertyp7214-web-search.sitesJson', () => promptUserReloadAtom());
    this.element = document.createElement('div');
    this.element.id = 'myFuckingIdOfThePlugin';
    this.element.style.overflow = 'hidden';
    atom.config.get('dertyp7214-web-search').sitesJson.split(', ').forEach(a => {
      const url = 'http://' + a;
      const div = document.createElement('div');
      const aTag = document.createElement('a');
      const favicon = document.createElement('div');
      favicon.style.float = 'left';
      favicon.style.width = '16px';
      favicon.style.height = '16px';
      favicon.style.marginRight = '4px';
      favicon.style.background = 'url(https://plus.google.com/_/favicon?domain=' + a + ')';
      aTag.target = '_blank';
      aTag.style.color = 'white';
      aTag.appendChild(favicon);
      if (a.startsWith('google')) {
        this.addClick(aTag, a, 'Google', url);
      } else if (a.startsWith('github')) {
        this.addClick(aTag, a, 'GitHub', url);
      } else if (a.startsWith('stackoverflow')) {
        this.addClick(aTag, a, 'Stack Overflow', url);
      } else {
        $.ajax({
          url: 'http://textance.herokuapp.com/title/' + a,
          complete: function (data) {
            const tmpClick = document.createElement('a');
            tmpClick.style.width = '0px';
            tmpClick.style.height = '0px';
            tmpClick.style.opacity = '0%';
            tmpClick.id = 'myFuckingId' + a;
            aTag.appendChild(tmpClick);
            aTag.appendChild(document.createTextNode(data.responseText));
            aTag.onclick = () => {
              let editor;
              if (editor = atom.workspace.getActiveTextEditor()) {
                let selection = editor.getSelectedText();
                tmpClick.href = url + '/search?q=' + selection;
                document.getElementById('myFuckingId' + a).click();
              }
            };
          }
        });
      }
      div.appendChild(aTag);
      div.style.float = 'left';
      div.style.paddingTop = '3px';
      div.style.paddingLeft = '5px';
      div.style.paddingRight = '5px';
      div.style.paddingBottom = '3px';
      div.title = a;
      this.element.appendChild(div);
    });
    const reloadTag = document.createElement('span');
    reloadTag.onclick = () => promptUserReloadAtom();
    reloadTag.appendChild(document.createTextNode('reload'));
    this.element.appendChild(reloadTag);
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

  addClick (aTag, a, title, url) {
    const tmpClick = document.createElement('a');
    tmpClick.style.width = '0px';
    tmpClick.style.height = '0px';
    tmpClick.style.opacity = '0%';
    tmpClick.id = 'myFuckingId' + a;
    aTag.appendChild(tmpClick);
    aTag.appendChild(document.createTextNode(title));
    aTag.onclick = () => {
      let editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        let selection = editor.getSelectedText();
        tmpClick.href = url + '/search?q=' + selection;
        document.getElementById('myFuckingId' + a).click();
      }
    };
  }
}

const promptUserReloadAtom = (msg = 'Reload `dertyp7214-web-search`') => {
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
