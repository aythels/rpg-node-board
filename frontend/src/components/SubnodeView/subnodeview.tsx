import './subnodeview.css';
import { Component } from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';
import { Subnode } from '../../types';
import { POSTsubnodeContent } from '../../mock-backend';

interface Props {
  subnode: Subnode;
  key: string;
}

interface State {
  subnode: Subnode;
  editor: Quill | null;
  change: Delta;
  autosaver: NodeJS.Timeout | null;
}

const autosaveFrequency = 10 * 1000;

export default class SubnodeView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Set state with info from backend

    this.state = {
      subnode: props.subnode,
      editor: null,
      change: new Delta(),
      autosaver: null,
    };
  }

  componentDidMount = (): void => {
    const editor = new Quill('#editor-' + this.state.subnode.id, {
      modules: {
        toolbar: [
          [
            {
              header: [1, 2, false],
            },
          ],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
      },
      placeholder: 'Compose an epic...',
      theme: 'snow',
    });
    editor.insertText(0, this.state.subnode.content, 'api');
    editor.on('text-change', (delta) => {
      this.setState({ change: this.state.change.compose(delta) });
    });
    this.setState({
      editor: editor,
      // Start autosaving
      autosaver: setInterval(this.saveEditorChanges, autosaveFrequency),
    });
  };

  componentWillUnmount = (): void => {
    if (this.state.autosaver) {
      clearInterval(this.state.autosaver);
    }
  };

  saveEditorChanges = (): void => {
    if (this.state.editor && this.state.change.length() > 0) {
      console.log('Saving changes for subnode ' + this.state.subnode.id);
      POSTsubnodeContent(this.state.subnode.id, JSON.stringify(this.state.editor.getContents()));
      this.setState({ change: new Delta() });
    }
  };

  render(): JSX.Element {
    const subnode = this.state.subnode;
    return (
      <div className="subnode">
        <h2>{subnode.type}</h2>
        <div id={'editor-' + this.state.subnode.id} />
      </div>
    );
  }
}
