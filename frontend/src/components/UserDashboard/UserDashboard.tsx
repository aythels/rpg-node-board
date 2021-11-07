import { Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { GameRow } from '../GameRow/gamerow';
import Typography from '@mui/material/Typography';
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
            <Typography variant="h2">Welcome, {GETuserById(this.props.userID).username} </Typography>
          </Grid>
          <Grid item>
            <SettingsIcon sx={{ fontSize: 100 }} />
          </Grid>
          <Grid item container>
            <Typography variant="h3">My games </Typography>
            <GameRow userID={this.props.userID} />
          </Grid>
        </Grid>
      </div>
    );
  }
}
