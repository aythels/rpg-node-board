import './canvasSidebarHeader.css';
import { ChangeEvent, Component, KeyboardEvent } from 'react';
import { Done, Edit, ChevronLeft, Settings } from '@mui/icons-material';
import { IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { MuiTheme } from '../../theme';
import { withTheme } from '@mui/styles';

interface Props extends MuiTheme {
  exposeSettings: boolean;
  onSubmitGameTitleClicked: (newTitle: string) => void;
  title: string;
  isAdmin: boolean;
  onSettingsToggleClicked: () => void;
}

interface State {
  editingTitle: boolean;
  title: string;
}

class CanvasSidebarHeader extends Component<Props, State> {
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

  handleSubmitTitle = (): void => {
    this.setState({
      editingTitle: false,
    });
    this.props.onSubmitGameTitleClicked(this.state.title);
  };

  handleCancelEdit = (): void => {
    this.setState({
      title: this.prevTitle,
      editingTitle: false,
    });
    this.prevTitle = '';
  };

  handleTitleTextFieldKeyPress = (event: KeyboardEvent<Element>): void => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.handleSubmitTitle();
        break;
      case 'Esc': // IE/Edge specific value
      case 'Escape':
        event.preventDefault();
        this.handleCancelEdit();
        break;
    }
  };

  render(): JSX.Element {
    return (
      <div className="canvas-sidebar-header" style={{ backgroundColor: this.props.theme.palette.primary.light }}>
        {this.props.isAdmin && !this.state.editingTitle && (
          <Tooltip arrow placement="left" title="Close game settings">
            <IconButton
              aria-label="Close game settings"
              component="span"
              className="temp"
              onClick={this.props.onSettingsToggleClicked}
            >
              {this.props.exposeSettings ? <ChevronLeft /> : <Settings />}
            </IconButton>
          </Tooltip>
        )}
        <div className="title">
          {this.props.exposeSettings && this.state.editingTitle ? (
            <TextField
              fullWidth
              autoComplete="off"
              className="title"
              id="outlined-basic"
              value={this.state.title}
              variant="outlined"
              onChange={this.handleTitleChanged}
              onKeyDown={this.handleTitleTextFieldKeyPress}
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
              <Tooltip arrow placement="left" title="Submit new title">
                <IconButton
                  aria-label="Submit edited game name"
                  component="span"
                  disabled={!this.state.title}
                  onClick={this.handleSubmitTitle}
                >
                  <Done />
                </IconButton>
              </Tooltip>
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

export default withTheme(CanvasSidebarHeader);
