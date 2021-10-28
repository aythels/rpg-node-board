import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  GETgame,
  GETplayers,
  GETuserById,
  GETuserByUsername,
  addUserToGame,
  demoteGameMasterToPlayer,
  promoteUserToGameMaster,
  removeUserFromGame,
  updateGameName,
} from './mock-backend';
import { Game, User } from './types';
import { ThemeProvider, createTheme } from '@mui/material';
import CanvasSidebar from './components/CanvasSidebar/CanvasSidebar';
import DummyComponent from './components/DummyComponent';
import Home from './components/Home';
import Modal from './components/Modal/Modal';
import { useState } from 'react';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {},
  });

  const [showUserNotFoundModal, setShowUserNotFoundModal] = useState(false);
  const [showDemoteLastGmModal, setShowDemoteLastGmModal] = useState(false);

  // Temp: Mock fetching data from backend
  const currentGameId = 7; // TODO: make part of state somewhere
  const [game, setGame] = useState<Game>(GETgame(currentGameId));
  const [users, setUsers] = useState<User[]>(GETplayers(game.id));

  const handleInviteUserClicked = (username: string) => {
    // Temp: Mock fetching data from backend
    const user = GETuserByUsername(username);
    if (user) {
      const newUsers = [...game.users, user.id];
      setGame((prevGame: Game) => ({
        ...prevGame,
        players: [...prevGame.players, user.id],
        users: newUsers,
      }));
      setUsers(newUsers.map(GETuserById));
      // Temp: Mock updating data on the backend
      addUserToGame(user, currentGameId);
    } else {
      setShowUserNotFoundModal(true);
    }
  };

  const handleRemoveUserClicked = (user: User) => {
    const newUsers = [...game.users.filter((id) => id !== user.id)];
    setGame((prevGame: Game) => ({
      ...prevGame,
      players: [...prevGame.players.filter((id) => id !== user.id)],
      gms: [...prevGame.gms.filter((id) => id !== user.id)],
      users: newUsers,
    }));
    setUsers(newUsers.map(GETuserById));

    // Temp: Mock updating data on the backend
    removeUserFromGame(user, currentGameId);
  };

  const handleSubmitTitleClicked = (newTitle: string) => {
    setGame((prevGame) => ({ ...prevGame, title: newTitle }));

    // Temp: Mock updating data on the backend
    updateGameName(game.id, newTitle);
  };

  const handlePromoteClicked = (id: number) => {
    setGame((prevGame) => ({
      ...prevGame,
      gms: [...prevGame.gms, id],
    }));

    // Temp: Mock updating data on the backend
    promoteUserToGameMaster(id, game.id);
  };

  const handleDemoteClicked = (id: number) => {
    if (game.gms.length === 1) {
      setShowDemoteLastGmModal(true);
    } else {
      setGame((prevGame) => ({
        ...prevGame,
        gms: [...prevGame.gms.filter((gmId) => gmId !== id)],
      }));
      // Temp: Mock updating data on the backend
      demoteGameMasterToPlayer(id, game.id);
    }
  };

  const prioritizeGameMasters = (allUsers: User[]) => {
    return [
      ...allUsers.filter((user: User) => game.gms.includes(user.id)),
      ...allUsers.filter((user: User) => !game.gms.includes(user.id)),
    ];
  };

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/dummy" render={() => <DummyComponent counterCaption="Increment counter" />} />
          <Route
            exact
            path="/sidebar"
            render={() => (
              // TODO: replace wrapper with canvas
              <div style={{ backgroundColor: 'red', height: '100vh' }}>
                <CanvasSidebar
                  currentUserId={2}
                  gameMasterIds={game.gms}
                  gameTitle={game.title}
                  users={prioritizeGameMasters(users)}
                  onDemoteClicked={handleDemoteClicked}
                  onInviteUserClicked={handleInviteUserClicked}
                  onPromoteClicked={handlePromoteClicked}
                  onRemoveUserClicked={handleRemoveUserClicked}
                  onSubmitTitleClicked={handleSubmitTitleClicked}
                />
              </div>
            )}
          />
        </Switch>
      </BrowserRouter>
      <Modal
        header="The user could not be found!"
        open={showUserNotFoundModal}
        onClose={() => setShowUserNotFoundModal(false)}
      />
      <Modal
        description="A game must have at least one game master at all times."
        header="Cannot demote last game master"
        open={showDemoteLastGmModal}
        onClose={() => setShowDemoteLastGmModal(false)}
      />
    </ThemeProvider>
  );
}

export default App;
