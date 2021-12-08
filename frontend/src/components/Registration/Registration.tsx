import './Registration.css';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { loginUser, selectIsLoggedIn } from '../../state/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RootState } from '../../state/rootReducer';

const Registration = (): JSX.Element => {
  const dispatch = useDispatch();
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const MIN_PASSWORD_LENGTH = 6;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [invalid, setInvalid] = useState(false);
  const [done, setDone] = useState(false);

  const loggedIn = useSelector((state: RootState) => selectIsLoggedIn(state));

  const registerUser = async (): Promise<void> => {
    // TODO
    const request = new Request(`${process.env.REACT_APP_API_URL}/user`, {
      method: 'post',
      body: JSON.stringify({ username: username, password: password, email: email }), //username, password, email go here
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });

    fetch(request)
      .then(async (res) => {
        // console.log(res.session.user);
        if (res.status != 200) {
          console.log('Invalid Combination');
          setInvalid(true);
        } else if (res.status === 200) {
          console.log('Registration successful');
          setDone(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setInvalid(true);
      });
  };

  return (
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
          <Typography variant="h1">Register</Typography>
        </Grid>
        <Grid item>
          <Typography style={{ fontStyle: 'italic' }}>Start worldbuilding today!</Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Username"
            style={{ backgroundColor: 'white' }}
            error={invalid}
            helperText={invalid ? 'Please pick something different!' : ''}
            onChange={(event) => {
              setUsername(event.target.value);
              setInvalid(false);
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Email"
            style={{ backgroundColor: 'white' }}
            error={invalid}
            helperText={invalid ? 'Please pick something different!' : ''}
            onChange={(event) => {
              setEmail(event.target.value);
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
            helperText={invalid ? 'Please pick something different!' : ''}
            onChange={(event) => {
              setPassword(event.target.value);
              setInvalid(false);
            }}
          />
        </Grid>
        <Grid item>
          <Button color={done ? 'success' : 'primary'} variant="contained" type="submit" onClick={registerUser}>
            {done ? 'Success!' : 'Register'}
          </Button>
        </Grid>
        <Grid item>
          <Button component={Link} to="/" variant="contained" color="primary">
            Back to Login
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Registration;
