import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Home from './components/Home';
import NodeView from './components/NodeView/nodeview';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Login from './components/Login/login';
import CanvasMain from './components/CanvasMain';

function App(): JSX.Element {
  const customTheme = createTheme({
    // Note: to be edited later
    palette: {},
  });

  // NOTE: this type of routing is temporary, and will be replaced in phase 2, most likely using some state management solution like redux.
  const currentGameId = 1;
  const userID = 1;
  const adminID = 2;

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
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

          <Route exact path="/login" render={() => <Login />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
