import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
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

  // NOTE: this type of routing is temporary, and will be replaced in phase 2, most likely using some state management solution like redux.
  const currentGameId = 1;
  const userID = 1;
  const adminID = 2;

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/canvasAdmin"
            render={() => <CanvasMain currentUserId={adminID} currentGameId={currentGameId} />}
          />
          <Route
            exact
            path="/canvasUser"
            render={() => <CanvasMain currentUserId={userID} currentGameId={currentGameId} />}
          />
          {/* <Route path="/canvas">
            <CanvasMain currentUserId={currentUserId} currentGameId={currentGameId} />
          </Route> */}
          {/* <Route path="/canvas" component={CanvasMain} /> */}

          <Route exact path="/gamesAdmin" render={() => <UserDashboard userID={adminID} />} />
          <Route exact path="/gamesUser" render={() => <UserDashboard userID={userID} />} />

          <Route exact path="/" render={() => <Login />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
