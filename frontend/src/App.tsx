import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Login from './components/Login/login';
import CanvasMain from './components/CanvasMain';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {},
  });

  const currentGameId = 1;
  const currentUserId = 2;

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route
            exact
            path="/canvas"
            render={() => <CanvasMain currentUserId={currentUserId} currentGameId={currentGameId} />}
          />
          <Route exact path="/games" render={() => <UserDashboard />} />
          <Route exact path="/login" render={() => <Login />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
