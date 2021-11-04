import './canvasSidebarFooter.css';
import { Button, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import Dialog from '../Dialog/Dialog';

interface Props {
  onInvitePlayerClicked: (username: string) => void;
}

interface State {
  inviteName: string;
  showDeleteServerDialog: boolean;
}

export default class CanvasSidebarFooter extends Component<Props, State> {
  state: State = {
    inviteName: '',
    showDeleteServerDialog: false,
  };

  handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inviteName: event.target.value });
  };

  render(): JSX.Element {
    return (
      <div className="canvas-sidebar-footer">
        <div className="item__wrapper">
          <div className="text-field__wrapper">
            <TextField
              autoComplete="off"
              className="text-field"
              id="outlined-basic"
              label="Enter player name"
              value={this.state.inviteName}
              variant="outlined"
              onChange={this.handleInviteNameChanged}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  this.props.onInvitePlayerClicked(this.state.inviteName);
                }
              }}
            />
          </div>
        </div>
        <div className="item__wrapper">
          <Button
            aria-label="invite user to the game"
            className="item"
            disabled={!this.state.inviteName}
            startIcon={<PersonAdd />}
            variant="contained"
            onClick={() => {
              this.props.onInvitePlayerClicked(this.state.inviteName);
            }}
          >
            Invite player
          </Button>
        </div>
        <div className="item__wrapper">
          <Button
            aria-label="delete game server"
            className="item delete-button"
            startIcon={<Delete />}
            variant="contained"
            onClick={() => this.setState({ showDeleteServerDialog: true })}
          >
            Delete server
          </Button>
        </div>
        <Dialog
          description="Doing so will immediately end the session and remove the game from the server."
          header="Delete server?"
          open={this.state.showDeleteServerDialog}
          onAgree={() => this.setState({ showDeleteServerDialog: false })}
          onAgreeRedirectTo="." // TODO: update target
          onClose={() => this.setState({ showDeleteServerDialog: false })}
          onDisagree={() => this.setState({ showDeleteServerDialog: false })}
        />
      </div>
    );
  }
}
