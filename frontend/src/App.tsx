import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Login from './components/Login/login';
import CanvasMain from './components/CanvasMain/CanvasMain';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';

// TODO: absolutely remove this!!!
import { fetchGame } from './state/slices/gameSlice';
import { store } from './state';
import { loginUser } from './state/slices/userSlice';
// store.dispatch(loginUser('admin'));
// store.dispatch(fetchGame('61a9dccdd7c3cec99261a408'));
store.dispatch(loginUser('user2'));
store.dispatch(fetchGame('61a9dcf5d7c3cec99261a409'));

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
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
