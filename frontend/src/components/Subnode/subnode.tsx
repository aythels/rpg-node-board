import './styles.css';
import { Component } from 'react';
import ReactQuill from 'react-quill';

interface Props {
  subnode: null;
  name: string;
}

interface State {
  name: string;
  text: string;
}

export default class Subnode extends Component<Props, State> {
  state: State = {
    name: '',
    text: '',
  };

  constructor(props: Props) {
    super(props);
    // Set state with info from backend
    this.state = {
      name: props.name,
      text: '',
    };
  }

  handleQuillChange = (value: string): void => {
    this.setState({ text: value });
  };

  render(): JSX.Element {
    return (
      <div className="subnode">
        <h2>{this.state.name}</h2>
        <ReactQuill value={this.state.text} onChange={this.handleQuillChange} />
      </div>
    );
  }
}
