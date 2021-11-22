/* eslint-disable */
/* tslint-disable */

import './styles.css';
import React from 'react';
import { GETgameById } from '../../mock-backend';
import { Game } from '../../types';
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

  handlePromotePlayerClicked = (id: number): void => {
    this.setState(
      (prevState: State) => ({
        game: {
          ...prevState.game,
          gms: [...prevState.game.gms, id],
        },
      }),
      // () => POSTpromoteUserToGameMaster(id, this.state.game.id), // TODO:
    );
  };

  handleDemotePlayerClicked = (id: number): void => {
    this.setState(
      (prevState: State) => ({
        game: {
          ...prevState.game,
          gms: prevState.game.gms.filter((gmId: number) => gmId !== id),
        },
      }),
      // () => POSTdemoteGameMasterToPlayer(id, this.state.game.id), // TODO:
    );
  };

  render(): JSX.Element {
    return (
      <div>
        <CanvasInternal currentUserId={this.props.currentUserId} currentGameId={this.props.currentGameId} />

        <RightSidebar
          currentUserId={this.props.currentUserId}
          gameId={this.state.game.id}
          gameMasterIds={this.state.game.gms}
          isAdmin={this.state.game.gms.includes(this.props.currentUserId)}
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
