import './footer.css';
import { Button, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import Dialog from '../../../Dialog/Dialog';

interface Props {
  onInvitePlayerClicked: (username: string) => void;
}

interface State {
  inviteName: string;
  showDeleteServerDialog: boolean;
}

export default class Footer extends Component<Props, State> {
  state: State = {
    inviteName: '',
    showDeleteServerDialog: false,
  };

  handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inviteName: event.target.value });
  };

  render(): JSX.Element {
    return (
      <div className="footer">
        <div className="footer__item">
          <div className="footer__text-field--wrapper">
            <TextField
              autoComplete="off"
              className="footer__item--inner"
              id="outlined-basic"
              label="Type player name"
              value={this.state.inviteName}
              variant="outlined"
              onChange={this.handleInviteNameChanged}
            />
          </div>
        </div>
        <div className="footer__item">
          <Button
            aria-label="invite user to the game"
            className="footer__item--inner"
            disabled={!this.state.inviteName}
            startIcon={<PersonAdd />}
            variant="contained"
            onClick={() => {
              this.props.onInvitePlayerClicked(this.state.inviteName);
              this.setState({
                inviteName: '',
              });
            }}
          >
            Invite player
          </Button>
        </div>
        <div className="footer__item">
          <Button
            aria-label="delete game server"
            className="footer__button--delete footer__item--inner"
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
