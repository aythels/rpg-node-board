import './styles.css';
import gridImage from './assets/grid.jpg';
import React from 'react';
import CanvasToolbar from './CanvasToolbar';
import CanvasNode from './CanvasNode';
import { NodeManager } from './actions/NodeManager';
import {
  GETgame,
  GETuserById,
  GETuserByUsername,
  POSTaddPlayerToGame,
  POSTdemoteGameMasterToPlayer,
  POSTpromoteUserToGameMaster,
  POSTremovePlayerFromGame,
  POSTupdateGameName,
} from '../../mock-backend';
import { Game, User } from '../../types';
import Dialog from '../Dialog/Dialog';
import CanvasSidebar from '../CanvasSidebar/CanvasSidebar';

interface Props {
  currentUserId: number;
  currentGameId: number;
}

interface State {
  game: Game;
  showUserNotFoundModal: boolean;
  showDemoteLastGmModal: boolean;
}

export default class CanvasMain extends React.Component<Props, State> {
  nodeManager = new NodeManager(this);

  state: State = {
    game: GETgame(this.props.currentGameId),
    showUserNotFoundModal: false,
    showDemoteLastGmModal: false,
  };

  handleInvitePlayerClicked = (username: string): void => {
    const user = GETuserByUsername(username);
    if (user) {
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

  handleRemovePlayerClicked = (user: User): void => {
    this.setState(
      (prevState: State) => ({
        game: {
          ...prevState.game,
          players: prevState.game.players.filter((id) => id !== user.id),
          gms: prevState.game.gms.filter((id) => id !== user.id),
          users: prevState.game.users.filter((id) => id !== user.id),
        },
      }),
      () => POSTremovePlayerFromGame(user.id, this.state.game.id),
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
    const isLastGameMaster = this.state.game.gms.length === 1;
    if (isLastGameMaster) {
      this.setState({
        showDemoteLastGmModal: true,
      });
    } else {
      this.setState(
        (prevState: State) => ({
          game: {
            ...prevState.game,
            gms: prevState.game.gms.filter((gmId) => gmId !== id),
          },
        }),
        () => POSTdemoteGameMasterToPlayer(id, this.state.game.id),
      );
    }
  };

  render(): JSX.Element {
    const array = this.nodeManager.allNodes.slice().reverse();

    return (
      <div>
        <div
          className="w"
          onPointerDown={this.nodeManager.onPress}
          onPointerMove={this.nodeManager.onMove}
          onPointerUp={this.nodeManager.onRelease}
          onPointerLeave={this.nodeManager.onRelease}
          onWheel={this.nodeManager.onWheel}
        >
          <div className="c" style={{ transform: `scale(${this.nodeManager.scale})` }}>
            <img
              id="img"
              src={gridImage}
              style={{ left: `${this.nodeManager.getFinalX()}px`, top: `${this.nodeManager.getFinalY()}px` }}
            />

            {array.map((node) => (
              <CanvasNode
                key={node.id}
                xPos={node.xPos}
                yPos={node.yPos}
                nodeWidth={node.width}
                nodeHeight={node.height}
                onCloseClicked={() => this.nodeManager.removeNode(node.id)}
              />
            ))}
          </div>
        </div>
        <CanvasToolbar
          onBackClicked={() => console.log('back')}
          onCenterClicked={this.nodeManager.setCenter}
          onAddClicked={this.nodeManager.createNode}
        />
        <CanvasSidebar
          currentUserId={this.props.currentUserId}
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
          header="The user could not be found!"
          open={this.state.showUserNotFoundModal}
          onClose={() => this.setState({ showUserNotFoundModal: false })}
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
