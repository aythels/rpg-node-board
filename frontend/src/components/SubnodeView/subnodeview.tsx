import './subnodeview.css';
import { Component } from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';
import NodeLinkBlot from '../../blots/NodeLink';
import { Game, Subnode, User, Node } from '../../types';
import { GETnodesInGame, GETuserCanEditSubnode, POSTsubnodeContent } from '../../mock-backend';

interface Props {
  game: Game;
  node: Node;
  subnode: Subnode;
  user: User;
  key: string;
  onLinkClick: (id: number, node: Node) => void;
}

interface State {
  subnode: Subnode;
  user: User;
  editor: Quill | null;
  change: Delta;
  autosaver: NodeJS.Timeout | null;
}

const autosaveFrequency = 1 * 1000;

const standardEditorToolbar = [
  [
    {
      header: [1, 2, false],
    },
  ],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  [{ script: 'sub' }, { script: 'super' }],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ align: [] }],
  ['image', 'code-block'],
  ['clean'],
];

NodeLinkBlot.blotName = 'nodelink';
NodeLinkBlot.tagName = 'nodelink';

Quill.register(NodeLinkBlot);

interface TextLink {
  location: number;
  length: number;
  name: string;
  id: number;
}

export default class SubnodeView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Set state with info from backend
    this.state = {
      subnode: props.subnode,
      user: props.user,
      editor: null,
      change: new Delta(),
      autosaver: null,
    };
  }

  componentDidMount = (): void => {
    this.loadEditor();
  };

  loadEditor = (): void => {
    const readOnly = !GETuserCanEditSubnode(this.state.user.id, this.state.subnode.id);
    const toolbar = readOnly ? false : standardEditorToolbar;

    const editor = new Quill('#editor-' + this.state.subnode.id, {
      modules: {
        toolbar: toolbar,
      },
      placeholder: 'Compose an epic...',
      readOnly: readOnly,
      theme: 'snow',
    });
    editor.setContents(this.state.subnode.content, 'api');
    editor.on('text-change', (delta) => {
      this.setState({ change: this.state.change.compose(delta) });
    });
    this.setState(
      {
        editor: editor,
        // Start autosaving
        autosaver: setInterval(this.saveEditorChanges, autosaveFrequency),
      },
      () => {
        this.updateNodeTextLinks();
      },
    );
  };

  updateNodeTextLinks = (): void => {
    if (this.state.editor) {
      // Remove outdated links
      this.state.editor.formatText(0, this.state.editor.getLength(), 'nodelink', false);

      // Add in new links:
      const nodes = GETnodesInGame(this.props.game.id); // <-- this is horribly inefficient
      const currentText = this.state.editor.getText();
      const links: TextLink[] = [];
      const names = [];
      for (const node of nodes) {
        names.push(node.name);
        let nextNameInstance = currentText.indexOf(node.name, 0);
        while (nextNameInstance != -1) {
          links.push({ location: nextNameInstance, length: node.name.length, name: node.name, id: node.id });
          nextNameInstance = currentText.indexOf(node.name, nextNameInstance + 1);
        }
      }
      for (const link of links) {
        this.state.editor.formatText(link.location, link.length, 'nodelink', link.id, 'api');
      }

      // Add onclick behaviour
      const nodeLinks = document.getElementsByTagName('nodelink');
      for (const nodeLink of nodeLinks) {
        nodeLink.addEventListener('click', () => {
          const linkId = nodeLink.getAttribute('linkid');
          if (linkId) this.props.onLinkClick(parseInt(linkId), this.props.node);
        });
      }
    }
  };

  componentWillUnmount = (): void => {
    if (this.state.autosaver) {
      clearInterval(this.state.autosaver);
    }
  };

  saveEditorChanges = (): void => {
    if (this.state.editor && this.state.change.length() > 0) {
      // console.log('Saving changes for subnode ' + this.state.subnode.id, this.state.change);
      POSTsubnodeContent(this.state.subnode.id, this.state.change);
      this.setState({ change: new Delta() }, this.updateNodeTextLinks);
    }
  };

  render(): JSX.Element {
    const subnode = this.state.subnode;
    return (
      <div className="subnodeview">
        <h2>{subnode.name}</h2>
        <div id={'editor-' + this.state.subnode.id} />
      </div>
    );
  }
}
