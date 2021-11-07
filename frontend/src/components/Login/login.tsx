import './login.css';
import { Button, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { Component, SyntheticEvent } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { VerifyLogin } from '../../mock-backend';
import { createBrowserHistory } from 'history';

interface LoginState {
  username: string;
  password: string;
}

export default class Login extends Component<Record<string, unknown>, LoginState> {
  constructor() {
    super({});
    this.state = {
      username: '',
      password: '',
    };
  }

  checkPassword = (): void => {
    console.log(this.state);
    if (!VerifyLogin(this.state.username, this.state.password)) {
      console.log('naope');
    } else {
      //route the user to the correct screen.
      // as referenced in README, we will be changing how we are doing this for phase 2, once we have a server etc
      const history = createBrowserHistory();
      history.push(this.state.username === 'admin' ? '/gamesAdmin' : '/gamesUser');
      console.log(history);
      history.go(0);
    }
  };

  render(): JSX.Element {
    return (
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <TextField label="Username" onChange={(event) => this.setState({ username: event.target.value })}></TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            type="password"
            onChange={(event) => this.setState({ password: event.target.value })}
          ></TextField>
        </Grid>
        <Grid item>
          <Button color="primary" variant="contained" type="submit" onClick={this.checkPassword}>
            Log In
          </Button>
        </Grid>
      </Grid>
    );
  }
}
