import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Login from './components/Login/login';
import CanvasMain from './components/CanvasMain/CanvasMain';
import SettingsMenu from './components/SettingsMenu/SettingsMenu';
import ClientSocket from './state/clientSocket';
import Registration from './components/Registration/Registration';
import React, { useState, useEffect } from 'react';
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
  let loggedIn = false;
  useEffect(() => {
    console.log('MOUNTED');

    const request = new Request(`${process.env.REACT_APP_API_URL}/user/check-session`, {
      method: 'get',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });

    fetch(request, { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 200) {
          console.log('Logged in!');
          loggedIn = true;
        } else {
          console.log('Logged out!');
          loggedIn = false;
        }
      })
      .catch((error) => {
        console.log(error);
        loggedIn = false;
      });
  }, []);

  const redirectToLogin = <Redirect push to="/" />;
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
          {/* <Route exact path="/test" component={loggedIn ? redirectToLogin : CanvasMain} /> */}

          <Route exact path="/games" component={UserDashboard} />
          <Route exact path="/settings" component={SettingsMenu} />
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Registration} />
          <Route render={() => <div>404: Not found</div>} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
