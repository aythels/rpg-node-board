/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Quill from 'quill';

let Inline = Quill.import('blots/inline');

class NodeLinkBlot extends Inline {
  static create(id) {
    let node = super.create();
    node.setAttribute('title', node.textContent);
    node.setAttribute('linkid', id);
    // node.addEventListener('click', () => {
    //   console.log(id);
    // });
    node.classList.add('nodelink');
    return node;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static formats(domNode) {
    // return domNode.getAttribute('url') || true;
    // console.log(domNode);
    return true;
  }

  format(name, value) {
    if (name === 'nodelink' && value) {
      this.domNode.setAttribute('linkid', value);
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
