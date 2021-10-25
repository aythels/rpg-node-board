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
  onInviteUserClicked: (username: string) => void;
  onRemoveUserClicked: (user: User) => void;
  users: User[];
  gameMasterIds: number[];
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

  handleInviteUserClicked = (): void => {
    this.props.onInviteUserClicked(this.state.inviteName);
    this.setState({
      inviteName: '',
    });
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
          {this.props.users.map((user: User) => (
            <div key={uuid()} className="player-card">
              <IconButton aria-label="Remove player" component="span">
                <PersonOutline />
              </IconButton>
              <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
              <div className="player-card__name">{`@${user.username}`}</div>
              {!this.props.gameMasterIds.includes(user.id) && (
                <div className="button--remove">
                  <IconButton
                    aria-label="Remove player"
                    component="span"
                    onClick={() => this.props.onRemoveUserClicked(user)}
                  >
                    <HighlightOff />
                  </IconButton>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="footer">
          <div className="footer__item__wrapper">
            <TextField
              className="footer__item"
              id="outlined-basic"
              label="Player name"
              value={this.state.inviteName}
              variant="outlined"
              onChange={this.handleInviteNameChanged}
            />
          </div>
          <div className="footer__item__wrapper">
            <Button
              aria-label="invite user to the game"
              className="footer__item"
              disabled={!this.state.inviteName}
              startIcon={<PersonAdd />}
              variant="contained"
              onClick={this.handleInviteUserClicked}
            >
              Invite user
            </Button>
          </div>
          <div className="footer__item__wrapper">
            {/* TODO: update link target */}
            <Link style={{ textDecoration: 'none' }} to=".">
              <Button
                aria-label="delete game server"
                className="footer__item"
                startIcon={<Delete />}
                variant="contained"
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
// - user promote
// - game name bind
// - game name change
// - modals
// - handle user already added
// - fix css class name
