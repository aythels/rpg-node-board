import './login.css';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { loginUser, selectIsLoggedIn } from '../../state/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../../state/rootReducer';

const Login = (): JSX.Element => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);
  const loggedIn = useSelector((state: RootState) => selectIsLoggedIn(state));

  const checkPassword = async (): Promise<void> => {
    // TODO
    const request = new Request(`${process.env.REACT_APP_API_URL}/user/login`, {
      method: 'post',
      body: JSON.stringify({ username: username, password: password }), //username and password go here
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });

    fetch(request)
      .then(async (res) => {
        // console.log(res.session.user);
        if (res.status === 401) {
          console.log('Login or password is invalid');
          setInvalid(true);
        } else if (res.status === 200) {
          console.log('Login successful');

          await dispatch(loginUser(username));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return loggedIn ? (
    <Redirect push to="/games" />
  ) : (
    <div>
      <div
        className="login-background"
        style={{
          zIndex: -1,
          position: 'absolute',
          width: `100vw`,
          height: `100vh`,
          backgroundColor: `white`,
          opacity: `0.5`,
          backgroundImage: `linear-gradient(#d2d3e1 4.4px, transparent 4.4px),
          linear-gradient(90deg, #d2d3e1 4.4px, transparent 4.4px), linear-gradient(#d2d3e1 2.2px, transparent 2.2px),
          linear-gradient(90deg, #d2d3e1 2.2px, #ffffff 2.2px)`,
          backgroundSize: `110px 110px, 110px 110px, 22px 22px, 22px 22px`,
          backgroundPosition: `-4.4px -4.4px, -4.4px -4.4px, -2.2px -2.2px, -2.2px -2.2px`,
        }}
      />
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <Typography variant="h1">Welcome</Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontStyle: 'italic' }}>to an unnamed RPG lore web application.</Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Username"
            style={{ backgroundColor: 'white' }}
            error={invalid}
            helperText={invalid ? 'Username or Password are invalid' : ''}
            onChange={(event) => {
              setUsername(event.target.value);
              setInvalid(false);
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            type="password"
            style={{ backgroundColor: 'white' }}
            error={invalid}
            helperText={invalid ? 'Username or Password are invalid' : ''}
            onChange={(event) => {
              setPassword(event.target.value);
              setInvalid(false);
            }}
          />
        </Grid>
        <Grid item>
          <Button color={invalid ? 'error' : 'primary'} variant="contained" type="submit" onClick={checkPassword}>
            Log In
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
