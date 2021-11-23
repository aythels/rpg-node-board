import './login.css';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { GETloginVerification } from '../../mock-backend';
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
    if (!GETloginVerification(username, password)) {
      console.info('Login or password is invalid');
      setInvalid(true);
    } else {
      console.log('starting login');
      await dispatch(loginUser(username));
    }
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
          opacity: `0.2`,
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
