import './canvasSidebarHeader.css';
import { ChangeEvent, Component } from 'react';
import { Close, Done, Edit } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';

interface Props {
  onSubmitGameTitleClicked: (newTitle: string) => void;
  title: string;
}

interface State {
  editingTitle: boolean;
  title: string;
}

export default class CanvasSidebarHeader extends Component<Props, State> {
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
    this.props.onSubmitGameTitleClicked(this.state.title);
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
      <div className="canvas-sidebar-header__wrapper">
        <div className="canvas-sidebar-header__title__wrapper">
          <TextField
            autoComplete="off"
            className="canvas-sidebar-header__title"
            disabled={!this.state.editingTitle}
            id="outlined-basic"
            value={this.state.title}
            variant="outlined"
            onChange={this.handleTitleChanged}
          />
        </div>
        <div className="canvas-sidebar-header__button">
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
