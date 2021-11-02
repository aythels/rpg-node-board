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
  playerToRemove?: number;
  playerToDemote?: number;
  playerToPromote?: number;
}

export default class CanvasSidebarPlayerList extends Component<Props, State> {
  state: State = {};

  handleUserRemove = (): void => {
    if (this.state.playerToRemove) {
      this.props.onRemovePlayerClicked(this.state.playerToRemove);
      this.setState({ playerToRemove: undefined });
    }
  };

  handleUserPromote = (): void => {
    if (this.state.playerToPromote) {
      this.props.onPromotePlayerClicked(this.state.playerToPromote);
      this.setState({ playerToPromote: undefined });
    }
  };

  handleUserDemote = (): void => {
    if (this.state.playerToDemote) {
      this.props.onDemotePlayerClicked(this.state.playerToDemote);
      this.setState({ playerToDemote: undefined });
    }
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
              onDemotePlayerClicked={() => {
                this.setState({ playerToDemote: user.id });
              }}
              onPromotePlayerClicked={() => {
                this.setState({ playerToPromote: user.id });
              }}
              onRemovePlayerClicked={() => {
                this.setState({ playerToRemove: user.id });
              }}
            />
          );
        })}
        <Dialog
          description="Doing so will prevent them from re-joining the game."
          header="Remove player?"
          open={this.state.playerToRemove !== undefined}
          onAgree={this.handleUserRemove}
          onClose={() => this.setState({ playerToRemove: undefined })}
          onDisagree={() => this.setState({ playerToRemove: undefined })}
        />
        <Dialog
          description="Doing so will grant them game master privileges."
          header="Promote player to game master?"
          open={this.state.playerToPromote !== undefined}
          onAgree={this.handleUserPromote}
          onClose={() => this.setState({ playerToPromote: undefined })}
          onDisagree={() => this.setState({ playerToPromote: undefined })}
        />
        <Dialog
          description="Doing so will take game master privileges from them."
          header="Demote game master to regular player?"
          open={this.state.playerToDemote !== undefined}
          onAgree={this.handleUserDemote}
          onClose={() => this.setState({ playerToDemote: undefined })}
          onDisagree={() => this.setState({ playerToDemote: undefined })}
        />
      </div>
    );
  }
}
