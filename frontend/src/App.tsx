import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Login from './components/Login/login';
import CanvasMain from './components/CanvasMain/CanvasMain';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import ClientSocket from './state/clientSocket';
import Registration from './components/Registration/Registration';

/* REMOVE BEFORE COMMIT */
// import { fetchGame } from './state/slices/gameSlice';
// import { store } from './state';
// import { loginUser } from './state/slices/userSlice';
// import { processUserGameData } from './state/slices/nodeviewSlice';

// store.dispatch(loginUser('admin'));
// store.dispatch(fetchGame('61a9dccdd7c3cec99261a408'));
// store.dispatch(processUserGameData(store.getState().user.userInstance.id, 1));
/* REMOVE BEFORE COMMIT */

// const clientSocket = new (ClientSocket as any)();

function App(): JSX.Element {
  const customTheme = createTheme({
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
        light: '#ff867c',
        main: '#ef5350',
        dark: '#b61827',
        contrastText: '#fff',
      },
      warning: {
        light: '#ffe97d',
        main: '#ffb74d',
        dark: '#c88719',
        contrastText: '#000',
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/canvas" component={CanvasMain} />
          <Route exact path="/games" component={UserDashboard} />
          <Route exact path="/settings" component={SettingsMenu} />
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Registration} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
