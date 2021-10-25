import './canvasSidebar.css';
import { Avatar, Button, IconButton, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, Edit, HighlightOff, PersonAdd, PersonOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { User } from '../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Props {
  players: User[];
  onInviteUserClicked: (userName: string) => void;
}

interface State {
  inviteName: string;
}

export default class CanvasSidebar extends Component<Props, State> {
  state: State = {
    inviteName: '',
  };

  handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inviteName: event.target.value });
  };

  render(): JSX.Element {
    return (
      <div className="sidebar">
        <div className="header">
          <div className="header__title">
            <TextField id="outlined-basic" label="Game" variant="outlined" />
          </div>
          <div className="header__button--edit">
            <IconButton aria-label="Edit game name" component="span">
              <Edit />
            </IconButton>
          </div>
        </div>
        <div className="player-list">
          {this.props.players.map((player: User) => (
            <div key={uuid()} className="player-card">
              <IconButton aria-label="Remove player" component="span">
                <PersonOutline />
              </IconButton>
              <Avatar>{player.username.charAt(0).toUpperCase()}</Avatar>
              <div className="player-card__name">{`@${player.username}`}</div>
              <div className="button--remove">
                <IconButton aria-label="Remove player" component="span">
                  <HighlightOff />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <div className="footer">
          <div className="footer__item__wrapper">
            <TextField
              value={this.state.inviteName}
              onChange={this.handleInviteNameChanged}
              className="footer__item"
              id="outlined-basic"
              label="Player name"
              variant="outlined"
            />
          </div>
          <div className="footer__item__wrapper">
            <Button
              onClick={() => {
                this.props.onInviteUserClicked(this.state.inviteName);
                this.setState({
                  inviteName: '',
                });
              }}
              className="footer__item"
              startIcon={<PersonAdd />}
              variant="contained"
              aria-label="invite user to the game"
              disabled={!this.state.inviteName}
            >
              Invite user
            </Button>
          </div>
          <div className="footer__item__wrapper">
            {/* TODO: update link target */}
            <Link to="." style={{ textDecoration: 'none' }}>
              <Button
                className="footer__item"
                startIcon={<Delete />}
                variant="contained"
                aria-label="delete game server"
              >
                Delete server
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

// TODO:
// - user remove
// - user promote
// - delete server
// - game name bind
// - game name change
// - modals
// - handle user already added
