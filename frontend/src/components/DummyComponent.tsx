import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { Component } from "react";

interface Props {
  counterCaption: string;
  deleteCaption: string;
}

interface State {
  counter: number;
}

export default class DummyComponent extends Component<Props, State> {
  state: State = {
    counter: 0,
  };

  incrementCounter = () => {
    this.setState({
      counter: this.state.counter + 1,
    });
  };

  render() {
    return (
      <>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={this.incrementCounter}>
            {this.props.counterCaption}: {this.state.counter}
          </Button>
          <Button variant="outlined" startIcon={<DeleteIcon />}>
            {this.props.deleteCaption}
          </Button>
        </Stack>
      </>
    );
  }
}
