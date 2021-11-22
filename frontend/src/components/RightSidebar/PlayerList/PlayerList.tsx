import './playerList.css';
import PlayerCard from '../PlayerCard/PlayerCard';
import { Component } from 'react';
import Dialog from '../../Dialog/Dialog';
import { User, UserPermission } from '../../../types';
import { connect } from 'react-redux';
import { removePlayer, selectGameMasters, updatePlayerPermission } from '../../../state/slices/gameSlice';
import { RootState } from '../../../state/rootReducer';
import { selectUsers } from '../../../state/slices/gameSlice';

interface ExternalProps {
  exposeSettings: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removePlayer: any;
  updatePlayerPermission: any;
}

interface ReduxProps {
  currentUserId: number;
  users: User[];
  gameMasterIds: number[];
}

interface Props extends ExternalProps, ReduxProps {}

interface State {
  playerToRemove?: number;
  playerToDemote?: number;
  playerToPromote?: number;
  showDemoteLastGmModal: boolean;
}

class PlayerListBase extends Component<Props, State> {
  state: State = {
    showDemoteLastGmModal: false,
  };

  handlePlayerRemove = (): void => {
    if (this.state.playerToRemove) {
      this.props.removePlayer(this.state.playerToRemove);
      this.setState({ playerToRemove: undefined });
    }
  };

  handlePlayerPromote = (): void => {
    if (this.state.playerToPromote) {
      this.props.updatePlayerPermission([this.state.playerToPromote, UserPermission.gameMaster]);
      this.setState({ playerToPromote: undefined });
    }
  };

  handlePlayerDemote = (): void => {
    if (this.state.playerToDemote) {
      this.props.updatePlayerPermission([this.state.playerToDemote, UserPermission.player]);
      this.setState({ playerToDemote: undefined });
    }
  };

  handlePlayerDemoteRequested = (id: number): void => {
    const isLastGameMaster = this.props.gameMasterIds.length === 1;
    if (isLastGameMaster) {
      this.setState({
        showDemoteLastGmModal: true,
      });
    } else {
      this.setState({
        playerToDemote: id,
      });
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
            <PlayerCard
              key={user.id}
              user={user}
              exposeSettings={this.props.exposeSettings}
              promotable={!isGameMaster}
              removable={!isGameMaster && !isCurrentPlayer}
              onDemotePlayerClicked={() => this.handlePlayerDemoteRequested(user.id)}
              onPromotePlayerClicked={() => this.setState({ playerToPromote: user.id })}
              onRemovePlayerClicked={() => this.setState({ playerToRemove: user.id })}
            />
          );
        })}
        <Dialog
          description="Doing so will prevent them from re-joining the game."
          header="Remove player?"
          open={this.state.playerToRemove !== undefined}
          onAgree={this.handlePlayerRemove}
          onClose={() => this.setState({ playerToRemove: undefined })}
          onDisagree={() => this.setState({ playerToRemove: undefined })}
        />
        <Dialog
          description="Doing so will grant them game master privileges."
          header="Promote player to game master?"
          open={this.state.playerToPromote !== undefined}
          onAgree={this.handlePlayerPromote}
          onClose={() => this.setState({ playerToPromote: undefined })}
          onDisagree={() => this.setState({ playerToPromote: undefined })}
        />
        <Dialog
          description="Doing so will take game master privileges from them."
          header="Demote game master to regular player?"
          open={this.state.playerToDemote !== undefined}
          onAgree={this.handlePlayerDemote}
          onClose={() => this.setState({ playerToDemote: undefined })}
          onDisagree={() => this.setState({ playerToDemote: undefined })}
        />
        <Dialog
          description="A game must have at least one game master at all times."
          header="Cannot demote last game master"
          open={this.state.showDemoteLastGmModal}
          onClose={() => this.setState({ showDemoteLastGmModal: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
  // TODO: work with User objects if we store User in UserPermissionRecord
  gameMasterIds: selectGameMasters(state),
  users: selectUsers(state),
  currentUserId: state.user.userInstance.id,
});

export default connect(mapStateToProps, { removePlayer, updatePlayerPermission })(PlayerListBase);
