import './subnodeview.css';
import { Component } from 'react';
import ReactQuill from 'react-quill';
import { Subnode } from '../../mock-backend';

interface Props {
  subnode: Subnode;
}

interface State {
  subnode: Subnode;
}

export default class SubnodeView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Set state with info from backend
    this.state = {
      subnode: props.subnode,
    };
  }

  handleQuillChange = (value: string): void => {
    const subnode = this.state.subnode;
    subnode.content = value;
    this.setState({ subnode: subnode });
  };

  render(): JSX.Element {
    const subnode = this.state.subnode;
    return (
      <div className="subnode">
        <h2>{subnode.type}</h2>
        <ReactQuill value={subnode.content} onChange={this.handleQuillChange} />
      </div>
    );
  }
}
