import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GETgame, GETplayers, GETuserById, GETuserByUsername, addUserToGame, removeUserFromGame } from './mock-backend';
import { Game, User } from './types';
import { ThemeProvider, createTheme } from '@mui/material';
import CanvasSidebar from './components/CanvasSidebar/CanvasSidebar';
import DummyComponent from './components/DummyComponent';
import Home from './components/Home';
import { useState } from 'react';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {},
  });

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
      alert(`User ${username} could not be found!`);
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
                  gameMasterIds={game.gms}
                  users={users}
                  onInviteUserClicked={handleInviteUserClicked}
                  onRemoveUserClicked={handleRemoveUserClicked}
                />
              </div>
            )}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
