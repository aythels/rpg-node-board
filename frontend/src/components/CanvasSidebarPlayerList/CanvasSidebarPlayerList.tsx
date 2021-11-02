import './canvasSidebarPlayerList.css';
import CanvasSidebarPlayerCard from '../CanvasSidebarPlayerCard/CanvasSidebarPlayerCard';
import { Component } from 'react';
import Dialog from '../Dialog/Dialog';
import { User } from '../../types';

interface Props {
  currentUserId: number;
  isAdmin: boolean;
  users: User[];
  gameMasterIds: number[];
  onRemovePlayerClicked: (id: number) => void;
  onPromotePlayerClicked: (id: number) => void;
  onDemotePlayerClicked: (id: number) => void;
}

interface State {
  showRemoveUserDialog: boolean;
  userIdToRemove?: number;
}

export default class CanvasSidebarPlayerList extends Component<Props, State> {
  state: State = {
    showRemoveUserDialog: false,
  };

  handleUserRemove = (): void => {
    if (this.state.userIdToRemove) {
      this.props.onRemovePlayerClicked(this.state.userIdToRemove);
    }
    this.setState({ showRemoveUserDialog: false, userIdToRemove: undefined });
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
      <div className="canvas-sidebar-player-list">
        {users.map((user: User) => {
          const isCurrentPlayer = user.id === this.props.currentUserId;
          const isGameMaster = this.props.gameMasterIds.includes(user.id);
          return (
            <CanvasSidebarPlayerCard
              key={user.id}
              isAdmin={this.props.isAdmin}
              promotable={!isGameMaster}
              removable={!isGameMaster && !isCurrentPlayer}
              user={user}
              onDemotePlayerClicked={this.props.onDemotePlayerClicked}
              onPromotePlayerClicked={this.props.onPromotePlayerClicked}
              onRemovePlayerClicked={(id: number) => {
                this.setState({ showRemoveUserDialog: true, userIdToRemove: id });
              }}
            />
          );
        })}
        <Dialog
          description="Doing so will prevent them from re-joining the game."
          header="Remove user?"
          open={this.state.showRemoveUserDialog}
          onAgree={this.handleUserRemove}
          onClose={() => this.setState({ showRemoveUserDialog: false, userIdToRemove: undefined })}
          onDisagree={() => this.setState({ showRemoveUserDialog: false, userIdToRemove: undefined })}
        />
      </div>
    );
  }
}
