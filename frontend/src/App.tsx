import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GETplayers, GETuserByUsername, addUserToGame } from './mock-backend';
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

  // Note: Mock fetching data from backend
  const currentGameId = 7;
  const [players, setPlayers] = useState(GETplayers(currentGameId));

  const handleInviteUserClicked = (username: string) => {
    // Note: Mock fetching data from backend
    const user = GETuserByUsername(username);
    if (user) {
      setPlayers((prevPlayers) => [...prevPlayers, user]);
      // Note: Mock adding data to backend
      addUserToGame(user, currentGameId);
    } else {
      alert(`User ${username} could not be found!`);
    }
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
                <CanvasSidebar players={players} onInviteUserClicked={handleInviteUserClicked} />
              </div>
            )}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
