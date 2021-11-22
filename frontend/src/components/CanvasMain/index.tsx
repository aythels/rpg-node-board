import './styles.css';
import React from 'react';
import { GETgameById, PATCHdemoteGameMasterToPlayer, PATCHpromoteUserToGameMaster } from '../../mock-backend';
import { Game, UserPermission, UserPermissionRecord } from '../../types';
import Dialog from '../Dialog/Dialog';
import RightSidebar from '../RightSidebar';
import CanvasInternal from '../CanvasInternal';
import { connect } from 'react-redux';
import { addPlayer, removePlayer } from '../../state/slices/gameSlice';

interface Props {
  currentUserId: number;
  currentGameId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPlayer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removePlayer: any;
}

interface State {
  game: Game;
  showUserNotFoundModal: boolean;
}

class CanvasMainBase extends React.Component<Props, State> {
  state: State = {
    game: GETgameById(this.props.currentGameId),
    showUserNotFoundModal: false,
  };

  handlePromotePlayerClicked = (id: number): void => {
    const upr = this.state.game.users.find((entry) => entry.userId === id) as UserPermissionRecord;
    upr.permission = UserPermission.gameMaster;
    this.setState({}, () => PATCHpromoteUserToGameMaster(id, this.state.game.id));
  };

  handleDemotePlayerClicked = (id: number): void => {
    const upr = this.state.game.users.find((entry) => entry.userId === id) as UserPermissionRecord;
    upr.permission = UserPermission.player;
    this.setState({}, () => PATCHdemoteGameMasterToPlayer(id, this.state.game.id));
  };

  render(): JSX.Element {
    return (
      <div>
        <CanvasInternal currentUserId={this.props.currentUserId} currentGameId={this.props.currentGameId} />

        <RightSidebar
          currentUserId={this.props.currentUserId}
          gameId={this.state.game.id}
          gameMasterIds={this.state.game.users
            .filter((e) => e.permission === UserPermission.gameMaster)
            .map((e) => e.userId)}
          isAdmin={this.state.game.users
            .filter((e) => e.permission === UserPermission.gameMaster)
            .map((e) => e.userId)
            .includes(this.props.currentUserId)}
          onDemotePlayerClicked={this.handleDemotePlayerClicked}
          onPromotePlayerClicked={this.handlePromotePlayerClicked}
        />

        <Dialog
          description="Please try again."
          header="The player could not be found!"
          open={this.state.showUserNotFoundModal}
          onClose={() => this.setState({ showUserNotFoundModal: false })}
        />
      </div>
    );
  }
}

export default connect(null, { addPlayer, removePlayer })(CanvasMainBase);
