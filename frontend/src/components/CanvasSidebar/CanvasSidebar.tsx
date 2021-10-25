import './canvasSidebar.css';
import { Avatar, Button, IconButton, TextField } from '@mui/material';
import { Delete, HighlightOff, PersonAdd, PersonOutline } from '@mui/icons-material';
import { Component } from 'react';
import { User } from '../../types';
// eslint-disable-next-line
// @ts-ignore react-uuid has no type declaration file
import uuid from 'react-uuid';

interface Props {
  players: User[];
}

export default class CanvasSidebar extends Component<Props> {
  tempPlayers = [
    ...this.props.players,
    ...this.props.players,
    ...this.props.players,
    ...this.props.players,
    ...this.props.players,
  ];

  render(): JSX.Element {
    return (
      <div className="sidebar">
        <div className="game-name">The best game</div>
        <div className="player-list">
          {this.tempPlayers.map((player: User) => (
            <div key={uuid()} className="player-card">
              <IconButton aria-label="Remove player" component="span">
                <PersonOutline />
              </IconButton>
              <Avatar>{player.username.charAt(0).toUpperCase()}</Avatar>
              <div className="player-card__name">{`@${player.username}`}</div>
              <div className="button--remove">
                <IconButton aria-label="Remove player" component="span">
                  <HighlightOff />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <div className="footer">
          <div className="footer__item__wrapper">
            <TextField className="footer__item" id="outlined-basic" label="Player name" variant="outlined" />
          </div>
          <div className="footer__item__wrapper">
            <Button
              className="footer__item"
              startIcon={<PersonAdd />}
              variant="contained"
              aria-label="invite user to the game"
            >
              Invite user
            </Button>
          </div>
          <div className="footer__item__wrapper">
            <Button className="footer__item" startIcon={<Delete />} variant="contained" aria-label="delete game server">
              Delete server
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
