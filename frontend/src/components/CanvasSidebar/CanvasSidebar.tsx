import './canvasSidebar.css';
import { Avatar, Button, IconButton, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Close, Delete, Done, Edit, HighlightOff, Person, PersonAdd, PersonOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { User } from '../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Props {
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
  editingTitle: boolean;
  title: string;
}

export default class CanvasSidebar extends Component<Props, State> {
  state: State = {
    inviteName: '',
    editingTitle: false,
    title: this.props.gameTitle,
  };
  prevTitle = '';

  // Handlers related to user invites
  handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inviteName: event.target.value });
  };

  handleInviteUserClicked = (): void => {
    const alreadyAdded = this.props.users.find((user: User) => user.username === this.state.inviteName);
    if (alreadyAdded) {
      alert(`This user is already in the game!`);
    } else {
      this.props.onInviteUserClicked(this.state.inviteName);
      this.setState({
        inviteName: '',
      });
    }
  };

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
    this.props.onSubmitTitleClicked(this.state.title);
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
      <div className="sidebar">
        <div className="header">
          <div className="header__title">
            <TextField
              className="header__title__textfield"
              disabled={!this.state.editingTitle}
              id="outlined-basic"
              value={this.state.title}
              variant="outlined"
              onChange={this.handleTitleChanged}
            />
          </div>
          <div className="header__button">
            {this.state.editingTitle ? (
              <>
                <IconButton
                  aria-label="Edit game name"
                  component="span"
                  disabled={!this.state.title}
                  onClick={this.handleSubmitTitleClicked}
                >
                  <Done />
                </IconButton>
                <IconButton aria-label="Edit game name" component="span" onClick={this.handleCancelEditClicked}>
                  <Close />
                </IconButton>
              </>
            ) : (
              <IconButton aria-label="Edit game name" component="span" onClick={this.handleEditTitleClicked}>
                <Edit />
              </IconButton>
            )}
          </div>
        </div>
        <div className="player-list">
          {this.props.users.map((user: User) => {
            const isGameMaster = this.props.gameMasterIds.includes(user.id);
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
                {!isGameMaster && (
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
      </div>
    );
  }
}

// TODO:
// - handle removing yourself - navigate back to homepage: https://www.telerik.com/blogs/programmatically-navigate-with-react-router
// - fix colours
// - fix css class naming

// - prevent suggestions in game name
// - highlight personal user bubble?
// - make colors semantic - delete button, cancel button in edit
// - replace alert with modals
// - add tooltips
// - add/check aria labels
