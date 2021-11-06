import './UserDashboard.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { GameRow } from '../GameRow/gamerow';
import { PureComponent } from 'react';

export default class UserDashboard extends PureComponent {
  render(): JSX.Element {
    return (
      <div className="wrapper">
        <GameRow userID={1} />
      </div>
    );
  }
}
