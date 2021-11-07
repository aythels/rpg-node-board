import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Login from './components/Login/login';
import CanvasMain from './components/CanvasMain';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {
      primary: {
        light: '#a4a4a4',
        main: '#757575',
        dark: '#494949',
        contrastText: '#fff',
      },
      common: {
        black: '#000',
        white: '#fff',
      },
      error: {
        light: '#ffe97d',
        main: '#ffb74d',
        dark: '#c88719',
        contrastText: '#000',
      },
      warning: {
        light: '#ff867c',
        main: '#ef5350',
        dark: '#b61827',
        contrastText: '#fff',
      },
    },
  });

  const currentGameId = 1;
  const currentUserId = 1;

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
