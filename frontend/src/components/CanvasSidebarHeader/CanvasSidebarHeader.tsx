import './canvasSidebarHeader.css';
import { ChangeEvent, Component, KeyboardEvent } from 'react';
import { Close, Done, Edit } from '@mui/icons-material';
import { IconButton, TextField, Tooltip, Typography } from '@mui/material';

interface Props {
  exposeSettings: boolean;
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

  handleSubmitTitleKeyPress = (event: KeyboardEvent<Element>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSubmitTitleClicked();
    }
  };

  render(): JSX.Element {
    return (
      <div className="canvas-sidebar-header">
        <div className="title__wrapper">
          {this.props.exposeSettings && this.state.editingTitle ? (
            <TextField
              autoComplete="off"
              className="title"
              id="outlined-basic"
              value={this.state.title}
              variant="outlined"
              onChange={this.handleTitleChanged}
              onKeyPress={this.handleSubmitTitleKeyPress}
            />
          ) : (
            <Typography className="title" variant="h6" component="div" align="center" noWrap={true}>
              {this.state.title}
            </Typography>
          )}
        </div>
        {this.props.exposeSettings && (
          <div className="button">
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
