import Box from '@mui/material/Box';
import { GameIcon } from '../GameIcon/GameIcon';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from '../../types';
import { RootState } from '../../state/rootReducer';
import { Add } from '@mui/icons-material';
import { Card, CardActionArea, TextField } from '@mui/material';
import { addGame } from '../../state/slices/userSlice';
import { useState } from 'react';

const GameRow = (): JSX.Element => {
  const games: Game[] = useSelector((state: RootState) => state.user.games);
  const [newGameText, setNewGameText] = useState('');
  const dispatch = useDispatch();

  return (
    <div style={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          p: 1,
          m: 1,
          bgcolor: 'transparent',
        }}
        style={{
          margin: '0 auto',
          justifyContent: 'center',
        }}
      >
        {games.map((game: Game) => (
          <GameIcon key={game._id} game={game} />
        ))}
        <Card
          sx={{
            width: 120,
            height: 120,
            p: 2,
            m: 1,
            textAlign: 'center',
          }}
          style={{ boxShadow: '0.1rem 0.1rem 0.7rem' }}
        >
          <CardActionArea onClick={() => dispatch(addGame(newGameText))}>
            <Add />
          </CardActionArea>
          <TextField
            value={newGameText}
            label="New Game Title"
            onChange={(e) => setNewGameText(e.target.value)}
          ></TextField>
        </Card>
      </Box>
    </div>
  );
};
export default GameRow;
