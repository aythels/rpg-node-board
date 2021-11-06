import './canvasSidebarFooter.css';
import { Button, TextField, IconButton, Tooltip } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import Dialog from '../Dialog/Dialog';
import { POSTremoveGame } from '../../mock-backend';

interface Props {
  onInvitePlayerClicked: (username: string) => void;
  gameId: number;
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
          <Tooltip arrow title="Invite player">
            <IconButton
              aria-label="Invite player to the game"
              component="span"
              disabled={!this.state.inviteName}
              onClick={() => this.props.onInvitePlayerClicked(this.state.inviteName)}
            >
              <PersonAdd />
            </IconButton>
          </Tooltip>
        </div>
        <Button
          aria-label="delete game server"
          className="delete-button"
          startIcon={<Delete />}
          variant="contained"
          onClick={() => this.setState({ showDeleteServerDialog: true })}
        >
          Delete server
        </Button>

        <Dialog
          description="Doing so will immediately end the session and remove the game from the server."
          header="Delete server?"
          open={this.state.showDeleteServerDialog}
          onAgree={() => POSTremoveGame(this.props.gameId)}
          onAgreeRedirectTo="." // TODO: update target
          onClose={() => this.setState({ showDeleteServerDialog: false })}
          onDisagree={() => this.setState({ showDeleteServerDialog: false })}
        />
      </div>
    );
  }
}
