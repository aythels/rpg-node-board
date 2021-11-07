import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import { GameRow } from '../GameRow/gamerow';
import { Component } from 'react';
import './UserDashboard.css';
import { GETuserById } from '../../mock-backend';

interface Props {
  userID: number;
}
export default class UserDashboard extends Component<Props> {
  render(): JSX.Element {
    return (
      <div className="padded_div">
        <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
          <Grid item>
            <h1>Welcome, {GETuserById(this.props.userID).username} </h1>
          </Grid>
          <Grid item>
            <SettingsIcon fontSize="large" />
          </Grid>
          <Grid item container>
            <h2>My games </h2>
            <GameRow userID={this.props.userID} />
          </Grid>
        </Grid>
      </div>
    );
  }
}
