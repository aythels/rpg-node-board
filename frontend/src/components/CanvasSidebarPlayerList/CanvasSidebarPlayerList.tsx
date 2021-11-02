import './canvasSidebarPlayerList.css';
import CanvasSidebarPlayerCard from '../CanvasSidebarPlayerCard/CanvasSidebarPlayerCard';
import { Component } from 'react';
import Dialog from '../Dialog/Dialog';
import { User } from '../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Props {
  currentUserId: number;
  users: User[];
  gameMasterIds: number[];
  onRemovePlayerClicked: (user: User) => void;
  onPromotePlayerClicked: (id: number) => void;
  onDemotePlayerClicked: (id: number) => void;
}

interface State {
  showRemoveUserDialog: boolean;
  userToRemove?: User;
}

export default class CanvasSidebarPlayerList extends Component<Props, State> {
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
            <CanvasSidebarPlayerCard
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
