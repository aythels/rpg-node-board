import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { GameRow } from '../GameRow/gamerow';
import { Component } from 'react';
import { GETuserById } from '../../mock-backend';

interface Props {
  userID: number;
}
export default class UserDashboard extends Component<Props> {
  render(): JSX.Element {
    return (
      <div>
        <h1>Welcome, {GETuserById(this.props.userID).username} </h1>
        <GameRow userID={this.props.userID} />
      </div>
    );
  }
}
