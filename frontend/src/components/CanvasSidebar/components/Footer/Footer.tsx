import './footer.css';
import { Button, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface Props {
  onInviteUserClicked: (username: string) => void;
}

interface State {
  inviteName: string;
}

export default class Footer extends Component<Props, State> {
  state: State = {
    inviteName: '',
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
              label="Player name"
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
              this.props.onInviteUserClicked(this.state.inviteName);
              this.setState({
                inviteName: '',
              });
            }}
          >
            Invite user
          </Button>
        </div>
        <div className="footer__item">
          {/* TODO: update link target */}
          <Link style={{ textDecoration: 'none' }} to=".">
            <Button
              aria-label="delete game server"
              className="footer__button--delete footer__item--inner"
              startIcon={<Delete />}
              variant="contained"
            >
              Delete server
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
