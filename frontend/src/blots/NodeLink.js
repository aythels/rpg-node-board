/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Quill from 'quill';

let Inline = Quill.import('blots/inline');

class NodeLinkBlot extends Inline {
  static create(url) {
    let node = super.create();
    // node.setAttribute('href', url);
    // node.setAttribute('target', '_self');
    node.setAttribute('title', node.textContent);
    node.setAttribute('style', 'color:blue');
    node.setAttribute('url', url);
    node.addEventListener('click', () => {
      console.log(url);
    });
    node.classList.add('nodelink');
    return node;
  }

  static formats(domNode) {
    // return domNode.getAttribute('url') || true;
    console.log(domNode); // To suppress warning
    return true;
  }

  format(name, value) {
    if (name === 'nodelink' && value) {
      this.domNode.setAttribute('url', value);
    } else {
      super.format(name, value);
    }
  }

  formats() {
    let formats = super.formats();
    formats['nodelink'] = NodeLinkBlot.formats(this.domNode);
    return formats;
  }
}

export default NodeLinkBlot;
