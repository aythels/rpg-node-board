import './canvasSidebar.css';
import { Button, TextField } from '@mui/material';
import { Component } from 'react';
import { Delete, Send } from '@mui/icons-material';
import { User } from '../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Props {
  players: User[];
}

export default class CanvasSidebar extends Component<Props> {
  render(): JSX.Element {
    return (
      <div className="sidebar">
        <div className="game-name">The best game</div>
        <div className="player-list">
          {this.props.players.map((player) => (
            <div key={uuid()} className="player">
              {player.username}
            </div>
          ))}
          {this.props.players.map((player) => (
            <div key={uuid()} className="player">
              {player.username}
            </div>
          ))}
          {this.props.players.map((player) => (
            <div key={uuid()} className="player">
              {player.username}
            </div>
          ))}
          {this.props.players.map((player) => (
            <div key={uuid()} className="player">
              {player.username}
            </div>
          ))}
          {this.props.players.map((player) => (
            <div key={uuid()} className="player">
              {player.username}
            </div>
          ))}
        </div>
        <div className="footer">
          <TextField id="outlined-basic" label="Player name" variant="outlined" />
          <Button startIcon={<Send />} variant="contained" aria-label="invite user to the game">
            Invite user
          </Button>
          <Button startIcon={<Delete />} variant="contained" aria-label="delete game server">
            Delete server
          </Button>
        </div>
      </div>
    );
  }
}
