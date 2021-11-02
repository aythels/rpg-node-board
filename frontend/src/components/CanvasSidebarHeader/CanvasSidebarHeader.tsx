import './canvasSidebarHeader.css';
import { ChangeEvent, Component } from 'react';
import { Close, Done, Edit } from '@mui/icons-material';
import { IconButton, TextField, Tooltip } from '@mui/material';

interface Props {
  isAdmin: boolean;
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
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                this.handleSubmitTitleClicked();
              }
            }}
          />
        </div>
        {this.props.isAdmin && (
          <div className="canvas-sidebar-header__button">
            {this.state.editingTitle ? (
              <>
                <Tooltip arrow title="Submit new title">
                  <IconButton
                    aria-label="Submit edited game name"
                    component="span"
                    disabled={!this.state.title}
                    onClick={this.handleSubmitTitleClicked}
                  >
                    <Done />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title="Discard changes">
                  <IconButton
                    aria-label="Stop editing game name and discard changes"
                    component="span"
                    onClick={this.handleCancelEditClicked}
                  >
                    <Close />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip arrow title="Edit game title">
                <IconButton aria-label="Edit game title" component="span" onClick={this.handleEditTitleClicked}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    );
  }
}
