import './login.css';
import { Button, Grid, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { Component, SyntheticEvent } from 'react';
import React, { useState } from 'react';
import { VerifyLogin } from '../../mock-backend';

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
  // handleNameChange = (e: SyntheticEvent): void => {
  //   const target = e.target as HTMLInputElement;
  //   this.setState({
  //     node: node,
  //   });
  // };

  submitStuff = (): void => {
    console.log(this.state);
    if (!VerifyLogin(this.state.username, this.state.password)) {
      console.log('naope');
    } else {
      console.log('yes'); //route the user to the correct screen.
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
          <Button color="primary" variant="contained" type="submit" onClick={this.submitStuff}>
            Log In
          </Button>
        </Grid>
      </Grid>
    );
  }
}
