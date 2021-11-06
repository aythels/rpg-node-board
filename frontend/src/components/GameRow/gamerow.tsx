/* eslint-disable sort-imports */
import { Game } from '../../types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { uid } from 'react-uid';
import React from 'react';
import { GameIcon } from '../GameIcon/gameicon';
import { GETgamesByUserID } from '../../mock-backend';

interface GameDisplayProps {
  userID: number;
}

export const GameRow: React.FunctionComponent<GameDisplayProps> = ({ userID }) => {
  const games = GETgamesByUserID(userID); //TODO pass user id in.

  return (
    <div style={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
        }}
      >
        {games.map((game) => (
          <GameIcon name={game.title} path={game.imgpath} userID={userID} gameID={gameID} key={uid(game)} />
        ))}
      </Box>
    </div>
  );
};
