import './canvasSidebar.css';
import { Avatar, Button, IconButton, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, HighlightOff, Person, PersonAdd, PersonOutline } from '@mui/icons-material';
import Header from './components/Header';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import { User } from '../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Props {
  currentUserId: number;
  onInviteUserClicked: (username: string) => void;
  onRemoveUserClicked: (user: User) => void;
  onSubmitTitleClicked: (newTitle: string) => void;
  onPromoteClicked: (id: number) => void;
  onDemoteClicked: (id: number) => void;
  users: User[];
  gameTitle: string;
  gameMasterIds: number[];
}

interface State {
  inviteName: string;
  showUserAlreadyInGameModal: boolean;
}
export default class CanvasSidebar extends Component<Props, State> {
  state: State = {
    inviteName: '',
    showUserAlreadyInGameModal: false,
  };

  // Handlers related to user invites
  handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inviteName: event.target.value });
  };

  handleInviteUserClicked = (): void => {
    const alreadyAdded = this.props.users.find((user: User) => user.username === this.state.inviteName);
    if (alreadyAdded) {
      this.setState({
        showUserAlreadyInGameModal: true,
      });
    } else {
      this.props.onInviteUserClicked(this.state.inviteName);
      this.setState({
        inviteName: '',
      });
    }
  };

  render(): JSX.Element {
    return (
      <div className="sidebar">
        <Header title={this.props.gameTitle} onSubmitTitleClicked={this.props.onSubmitTitleClicked} />
        <div className="player-list">
          {this.props.users.map((user: User) => {
            const isGameMaster = this.props.gameMasterIds.includes(user.id);
            const isCurrentPlayer = user.id === this.props.currentUserId;
            return (
              <div key={uuid()} className="player-card">
                {isGameMaster ? (
                  <IconButton
                    aria-label={`Demote game master ${user.username} to regular player`}
                    component="span"
                    onClick={() => this.props.onDemoteClicked(user.id)}
                  >
                    <Person />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label={`Promote player ${user.username} to game master`}
                    component="span"
                    onClick={() => this.props.onPromoteClicked(user.id)}
                  >
                    <PersonOutline />
                  </IconButton>
                )}
                <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                <div className="player-card__name">{`@${user.username}`}</div>
                {!isGameMaster && !isCurrentPlayer && (
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
            );
          })}
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
        <Modal
          description="You cannot add the same user twice."
          header="This user is already in the game!"
          open={this.state.showUserAlreadyInGameModal}
          onClose={() => this.setState({ showUserAlreadyInGameModal: false })}
        />
      </div>
    );
  }
}

// TODO:
// - code refactor
// - fix colours
// -> make colors semantic - delete button, cancel button in edit
// - fix css class naming

// - highlight personal user bubble?

// - add/check aria labels

// - add tooltips
