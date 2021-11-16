import './styles.css';
import React from 'react';
import {
  GETgameById,
  GETuserById,
  GETuserByUsername,
  POSTaddPlayerToGame,
  POSTdemoteGameMasterToPlayer,
  POSTpromoteUserToGameMaster,
  POSTremovePlayerFromGame,
  POSTupdateGameName,
} from '../../mock-backend';
import { Game } from '../../types';
import Dialog from '../Dialog/Dialog';
import RightSidebar from '../RightSidebar';
import CanvasInternal from '../CanvasInternal';
import { connect } from 'react-redux';
import { addPlayer } from '../../state/action-creators';

interface Props {
  currentUserId: number;
  currentGameId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPlayer: any;
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

  handleInvitePlayerClicked = (username: string): void => {
    const user = GETuserByUsername(username);
    if (user) {
      this.props.addPlayer(user.id);
      this.setState(
        (prevState: State) => ({
          game: {
            ...prevState.game,
            players: [...prevState.game.players, user.id],
            users: [...prevState.game.users, user.id],
          },
        }),
        () => POSTaddPlayerToGame(user.id, this.state.game.id),
      );
    } else {
      this.setState({
        showUserNotFoundModal: true,
      });
    }
  };

  handleRemovePlayerClicked = (playerId: number): void => {
    this.setState(
      (prevState: State) => ({
        game: {
          ...prevState.game,
          players: prevState.game.players.filter((id) => id !== playerId),
          gms: prevState.game.gms.filter((id) => id !== playerId),
          users: prevState.game.users.filter((id) => id !== playerId),
        },
      }),
      () => POSTremovePlayerFromGame(playerId, this.state.game.id),
    );
  };

  handleSubmitGameTitleClicked = (newTitle: string): void => {
    this.setState(
      (prevState: State) => ({
        game: {
          ...prevState.game,
          title: newTitle,
        },
      }),
      () => POSTupdateGameName(this.state.game.id, newTitle),
    );
  };

  handlePromotePlayerClicked = (id: number): void => {
    this.setState(
      (prevState: State) => ({
        game: {
          ...prevState.game,
          gms: [...prevState.game.gms, id],
        },
      }),
      () => POSTpromoteUserToGameMaster(id, this.state.game.id),
    );
  };

  handleDemotePlayerClicked = (id: number): void => {
    this.setState(
      (prevState: State) => ({
        game: {
          ...prevState.game,
          gms: prevState.game.gms.filter((gmId) => gmId !== id),
        },
      }),
      () => POSTdemoteGameMasterToPlayer(id, this.state.game.id),
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
          gameTitle={this.state.game.title}
          isAdmin={this.state.game.gms.includes(this.props.currentUserId)}
          users={this.state.game.users.map(GETuserById)}
          onDemotePlayerClicked={this.handleDemotePlayerClicked}
          onInvitePlayerClicked={this.handleInvitePlayerClicked}
          onPromotePlayerClicked={this.handlePromotePlayerClicked}
          onRemovePlayerClicked={this.handleRemovePlayerClicked}
          onSubmitGameTitleClicked={this.handleSubmitGameTitleClicked}
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

export default connect(null, { addPlayer })(CanvasMainBase);
