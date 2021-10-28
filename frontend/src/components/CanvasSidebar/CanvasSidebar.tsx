import './canvasSidebar.css';
import { Button, TextField } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import Header from './components/Header/Header';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import PlayerList from './components/PlayerList/PlayerList';
import { User } from '../../types';

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
        <PlayerList
          currentUserId={this.props.currentUserId}
          gameMasterIds={this.props.gameMasterIds}
          users={this.props.users}
          onDemoteClicked={this.props.onDemoteClicked}
          onPromoteClicked={this.props.onPromoteClicked}
          onRemoveUserClicked={this.props.onRemoveUserClicked}
        />
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
// - fix bug in playerlist - demote promote not working
// - refactor footer

// - fix colours
// -> make colors semantic - delete button, cancel button in edit

// - highlight personal user bubble?

// - add/check aria labels
// - add tooltips
