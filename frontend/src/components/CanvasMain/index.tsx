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
  game: any;
  showUserNotFoundModal: boolean;
}

class CanvasMainBase extends React.Component<Props, State> {
  state: State = {
    game: GETgameById(this.props.currentGameId),
    showUserNotFoundModal: false,
  };

  render(): JSX.Element {
    return (
      <div>
        <CanvasInternal currentUserId={this.props.currentUserId} currentGameId={this.props.currentGameId} />

        <RightSidebar
          currentUserId={this.props.currentUserId}
          gameId={this.state.game.id}
          gameMasterIds={this.state.game.users
            .filter((e: any) => e.permission === UserPermission.gameMaster)
            .map((e: any) => e.userId)}
          isAdmin={this.state.game.users
            .filter((e: any) => e.permission === UserPermission.gameMaster)
            .map((e: any) => e.userId)
            .includes(this.props.currentUserId)}
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
