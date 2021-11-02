import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  GETgame,
  GETuserById,
  GETuserByUsername,
  POSTaddPlayerToGame,
  POSTdemoteGameMasterToPlayer,
  POSTpromoteUserToGameMaster,
  POSTremovePlayerFromGame,
  POSTupdateGameName,
} from './mock-backend';
import { Game, User } from './types';
import { ThemeProvider, createTheme } from '@mui/material';
import CanvasSidebar from './components/CanvasSidebar/CanvasSidebar';
import Dialog from './components/Dialog/Dialog';
import DummyComponent from './components/DummyComponent';
import CanvasMain from './components/CanvasMain';
import Home from './components/Home';
import { useState } from 'react';
import NodeView from './components/NodeView/nodeview';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {},
  });

  const [showUserNotFoundModal, setShowUserNotFoundModal] = useState(false);
  const [showDemoteLastGmModal, setShowDemoteLastGmModal] = useState(false);

  const currentGameId = 7;
  const currentUserId = 2;
  const [game, setGame] = useState(GETgame(currentGameId));

  const handleInvitePlayerClicked = (username: string) => {
    const user = GETuserByUsername(username);
    if (user) {
      const newUsers = [...game.users, user.id];
      setGame((prevGame: Game) => ({
        ...prevGame,
        players: [...prevGame.players, user.id],
        users: newUsers,
      }));

      POSTaddPlayerToGame(user.id, currentGameId);
    } else {
      setShowUserNotFoundModal(true);
    }
  };

  const handleRemovePlayerClicked = (user: User) => {
    const newUsers = [...game.users.filter((id) => id !== user.id)];
    setGame((prevGame: Game) => ({
      ...prevGame,
      players: [...prevGame.players.filter((id) => id !== user.id)],
      gms: [...prevGame.gms.filter((id) => id !== user.id)],
      users: newUsers,
    }));

    POSTremovePlayerFromGame(user.id, currentGameId);
  };

  const handleSubmitGameTitleClicked = (newTitle: string) => {
    setGame((prevGame) => ({ ...prevGame, title: newTitle }));

    POSTupdateGameName(game.id, newTitle);
  };

  const handlePromotePlayerClicked = (id: number) => {
    setGame((prevGame) => ({
      ...prevGame,
      gms: [...prevGame.gms, id],
    }));

    POSTpromoteUserToGameMaster(id, game.id);
  };

  const handleDemotePlayerClicked = (id: number) => {
    if (game.gms.length === 1) {
      setShowDemoteLastGmModal(true);
    } else {
      setGame((prevGame) => ({
        ...prevGame,
        gms: [...prevGame.gms.filter((gmId) => gmId !== id)],
      }));
      POSTdemoteGameMasterToPlayer(id, game.id);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/canvas" render={() => <CanvasMain />} />
          <Route exact path="/dummy" render={() => <DummyComponent counterCaption="Increment counter" />} />
          <Route
            exact
            path="/sidebar"
            render={() => (
              <div style={{ backgroundColor: 'lightgray', height: '100vh' }}>
                <CanvasSidebar
                  currentUserId={currentUserId}
                  gameMasterIds={game.gms}
                  gameTitle={game.title}
                  isAdmin={game.gms.includes(currentUserId)}
                  users={game.users.map(GETuserById)}
                  onDemotePlayerClicked={handleDemotePlayerClicked}
                  onInvitePlayerClicked={handleInvitePlayerClicked}
                  onPromotePlayerClicked={handlePromotePlayerClicked}
                  onRemovePlayerClicked={handleRemovePlayerClicked}
                  onSubmitGameTitleClicked={handleSubmitGameTitleClicked}
                />
              </div>
            )}
          />
          <Route exact path="/nodeviewAdmin" render={() => <NodeView nodeId={1} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewUser" render={() => <NodeView nodeId={1} userId={1} gameId={1} />} />
          {/* TODO: Figure out how to route this better */}
          <Route exact path="/nodeviewAdmin/1" render={() => <NodeView nodeId={1} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewAdmin/2" render={() => <NodeView nodeId={2} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewAdmin/3" render={() => <NodeView nodeId={3} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewAdmin/4" render={() => <NodeView nodeId={4} userId={2} gameId={1} />} />
          <Route exact path="/nodeviewUser/1" render={() => <NodeView nodeId={1} userId={1} gameId={1} />} />
          <Route exact path="/nodeviewUser/2" render={() => <NodeView nodeId={2} userId={1} gameId={1} />} />
          <Route exact path="/nodeviewUser/3" render={() => <NodeView nodeId={3} userId={1} gameId={1} />} />
          <Route exact path="/nodeviewUser/4" render={() => <NodeView nodeId={4} userId={1} gameId={1} />} />
        </Switch>
      </BrowserRouter>
      <Dialog
        description="Please try again."
        header="The user could not be found!"
        open={showUserNotFoundModal}
        onClose={() => setShowUserNotFoundModal(false)}
      />
      <Dialog
        description="A game must have at least one game master at all times."
        header="Cannot demote last game master"
        open={showDemoteLastGmModal}
        onClose={() => setShowDemoteLastGmModal(false)}
      />
    </ThemeProvider>
  );
}

export default App;
