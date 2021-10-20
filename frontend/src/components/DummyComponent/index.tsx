import './styles.css';
import Button from '@mui/material/Button';
import { Component } from 'react';

interface Props {
  counterCaption: string;
}

interface State {
  counter: number;
}

export default class DummyComponent extends Component<Props, State> {
  state: State = {
    counter: 0,
  };

  incrementCounter = (): void => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  render(): JSX.Element {
    return (
      <div className="wrapper">
        <Button variant="contained" onClick={this.incrementCounter}>
          {this.props.counterCaption}: {this.state.counter}
        </Button>
      </div>
    );
  }
}
