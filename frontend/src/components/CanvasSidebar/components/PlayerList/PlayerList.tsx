import './playerList.css';
import { Avatar, IconButton } from '@mui/material';
import { Component, PureComponent } from 'react';
import { HighlightOff, Person, PersonOutline } from '@mui/icons-material';
import Dialog from '../../../Dialog/Dialog';
import { User } from '../../../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Handlers {
  onRemovePlayerClicked: (user: User) => void;
  onPromotePlayerClicked: (id: number) => void;
  onDemotePlayerClicked: (id: number) => void;
}

interface PlayerCardProps extends Handlers {
  promotable: boolean;
  removable: boolean;
  user: User;
}
class PlayerCard extends PureComponent<PlayerCardProps> {
  render() {
    const { promotable, removable, user } = this.props;
    return (
      <div className="player-list__card">
        {promotable ? (
          <IconButton
            aria-label={`Promote player ${user.username} to game master`}
            component="span"
            onClick={() => this.props.onPromotePlayerClicked(user.id)}
          >
            <PersonOutline />
          </IconButton>
        ) : (
          <IconButton
            aria-label={`Demote game master ${user.username} to regular player`}
            component="span"
            onClick={() => this.props.onDemotePlayerClicked(user.id)}
          >
            <Person />
          </IconButton>
        )}
        <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
        <div className="player-list__card__name">{`@${user.username}`}</div>
        {removable && (
          <div className="button--remove">
            <IconButton
              aria-label="Remove player"
              component="span"
              onClick={() => this.props.onRemovePlayerClicked(user)}
            >
              <HighlightOff />
            </IconButton>
          </div>
        )}
      </div>
    );
  }
}

interface Props extends Handlers {
  currentUserId: number;
  users: User[];
  gameMasterIds: number[];
}

interface State {
  showRemoveUserDialog: boolean;
  userToRemove?: User;
}

export default class PlayerList extends Component<Props, State> {
  state: State = {
    showRemoveUserDialog: false,
  };

  handleUserRemove = (): void => {
    if (this.state.userToRemove) {
      this.props.onRemovePlayerClicked(this.state.userToRemove);
    }
    this.setState({ showRemoveUserDialog: false, userToRemove: undefined });
  };

  prioritizeGameMasters = (gameMasterIds: number[], allUsers: User[]): User[] => {
    const A_BEFORE_B = -1;
    const B_BEFORE_A = 1;
    const gms = new Set(gameMasterIds);
    return [...allUsers].sort((a: User, b: User) => {
      const isGameMasterA = gms.has(a.id);
      const isGameMasterB = gms.has(b.id);
      if (isGameMasterA === isGameMasterB) {
        return a.username < b.username ? A_BEFORE_B : B_BEFORE_A;
      } else if (isGameMasterA && !isGameMasterB) {
        return A_BEFORE_B;
      } else {
        return B_BEFORE_A;
      }
    });
  };

  render(): JSX.Element {
    const users = this.prioritizeGameMasters(this.props.gameMasterIds, this.props.users);

    return (
      <div className="player-list">
        {users.map((user: User) => {
          const isCurrentPlayer = user.id === this.props.currentUserId;
          const isGameMaster = this.props.gameMasterIds.includes(user.id);
          return (
            <PlayerCard
              key={uuid()}
              promotable={!isGameMaster}
              removable={!isGameMaster && !isCurrentPlayer}
              user={user}
              onDemotePlayerClicked={this.props.onDemotePlayerClicked}
              onPromotePlayerClicked={this.props.onPromotePlayerClicked}
              onRemovePlayerClicked={(userToRemove: User) => {
                this.setState({ showRemoveUserDialog: true, userToRemove });
              }}
            />
          );
        })}
        <Dialog
          description="Doing so will prevent them from re-joining the game."
          header="Remove user?"
          open={this.state.showRemoveUserDialog}
          onAgree={this.handleUserRemove}
          onClose={() => this.setState({ showRemoveUserDialog: false, userToRemove: undefined })}
          onDisagree={() => this.setState({ showRemoveUserDialog: false, userToRemove: undefined })}
        />
      </div>
    );
  }
}
