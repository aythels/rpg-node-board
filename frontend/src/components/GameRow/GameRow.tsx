import Box from '@mui/material/Box';
import { GameIcon } from '../GameIcon/GameIcon';
import { useSelector } from 'react-redux';
import { Game } from '../../types';
import { RootState } from '../../state/rootReducer';

const GameRow = (): JSX.Element => {
  const games: Game[] = useSelector((state: RootState) => state.user.games);

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
      </Box>
    </div>
  );
};
export default GameRow;
