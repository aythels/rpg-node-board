import './playerList.css';
import { Avatar, IconButton } from '@mui/material';
import { Component, PureComponent } from 'react';
import { HighlightOff, Person, PersonOutline } from '@mui/icons-material';
import { User } from '../../../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Handlers {
  onRemoveUserClicked: (user: User) => void;
  onPromoteClicked: (id: number) => void;
  onDemoteClicked: (id: number) => void;
}

interface Props extends Handlers {
  currentUserId: number;
  users: User[];
  gameMasterIds: number[];
}

interface State {
  inviteName: string;
  showUserAlreadyInGameModal: boolean;
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
            onClick={() => this.props.onPromoteClicked(user.id)}
          >
            <PersonOutline />
          </IconButton>
        ) : (
          <IconButton
            aria-label={`Demote game master ${user.username} to regular player`}
            component="span"
            onClick={() => this.props.onDemoteClicked(user.id)}
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
              onClick={() => this.props.onRemoveUserClicked(user)}
            >
              <HighlightOff />
            </IconButton>
          </div>
        )}
      </div>
    );
  }
}

export default class PlayerList extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className="player-list">
        {this.props.users.map((user: User) => {
          const isCurrentPlayer = user.id === this.props.currentUserId;
          const isGameMaster = this.props.gameMasterIds.includes(user.id);
          return (
            <PlayerCard
              key={uuid()}
              promotable={!isGameMaster}
              removable={!isGameMaster && !isCurrentPlayer}
              user={user}
              onDemoteClicked={this.props.onDemoteClicked}
              onPromoteClicked={this.props.onPromoteClicked}
              onRemoveUserClicked={this.props.onRemoveUserClicked}
            />
          );
        })}
      </div>
    );
  }
}
