import './login.css';
import { Button, Grid, TextField } from '@mui/material';
import { Component } from 'react';
import React from 'react';
import { VerifyLogin } from '../../mock-backend';
import { createBrowserHistory } from 'history';

interface LoginState {
  username: string;
  password: string;
  invalid: boolean;
}

export default class Login extends Component<Record<string, unknown>, LoginState> {
  constructor() {
    super({});
    this.state = {
      username: '',
      password: '',
      invalid: false,
    };
  }

  checkPassword = (): void => {
    console.log(this.state);
    console.log(this.props);
    if (!VerifyLogin(this.state.username, this.state.password)) {
      console.log('login or password is invalid');
      this.setState({ invalid: true });
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
          <TextField
            label="Username"
            error={this.state.invalid}
            helperText={this.state.invalid ? 'Username or Password are invalid' : ''}
            onChange={(event) => this.setState({ username: event.target.value })}
          ></TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            type="password"
            error={this.state.invalid}
            helperText={this.state.invalid ? 'Username or Password are invalid' : ''}
            onChange={(event) => this.setState({ password: event.target.value })}
          ></TextField>
        </Grid>
        <Grid item>
          <Button
            color={this.state.invalid ? 'error' : 'primary'}
            variant="contained"
            type="submit"
            onClick={this.checkPassword}
          >
            Log In
          </Button>
        </Grid>
      </Grid>
    );
  }
}
