import './header.css';
import { ChangeEvent, Component } from 'react';
import { Close, Done, Edit } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';

interface Props {
  onSubmitTitleClicked: (newTitle: string) => void;
  title: string;
}

interface State {
  editingTitle: boolean;
  title: string;
}

export default class Header extends Component<Props, State> {
  state: State = {
    editingTitle: false,
    title: this.props.title,
  };
  prevTitle = '';

  // Handlers related to game title
  handleTitleChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ title: event.target.value });
  };

  handleEditTitleClicked = (): void => {
    this.prevTitle = this.state.title;
    this.setState({
      editingTitle: true,
    });
  };

  handleSubmitTitleClicked = (): void => {
    this.setState({
      editingTitle: false,
    });
    this.props.onSubmitTitleClicked(this.state.title);
  };

  handleCancelEditClicked = (): void => {
    this.setState({
      title: this.prevTitle,
      editingTitle: false,
    });
    this.prevTitle = '';
  };

  render(): JSX.Element {
    return (
      <div className="header">
        <div className="header__title">
          <TextField
            autoComplete="off"
            className="header__title__textfield"
            disabled={!this.state.editingTitle}
            id="outlined-basic"
            value={this.state.title}
            variant="outlined"
            onChange={this.handleTitleChanged}
          />
        </div>
        <div className="header__button">
          {this.state.editingTitle ? (
            <>
              <IconButton
                aria-label="Submit edited game name"
                component="span"
                disabled={!this.state.title}
                onClick={this.handleSubmitTitleClicked}
              >
                <Done />
              </IconButton>
              <IconButton
                aria-label="Stop editing game name and discard changes"
                component="span"
                onClick={this.handleCancelEditClicked}
              >
                <Close />
              </IconButton>
            </>
          ) : (
            <IconButton aria-label="Edit game name" component="span" onClick={this.handleEditTitleClicked}>
              <Edit />
            </IconButton>
          )}
        </div>
      </div>
    );
  }
}
