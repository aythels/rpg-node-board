import Box from '@mui/material/Box';
import { uid } from 'react-uid';
import { GameIcon } from '../GameIcon/gameicon';
import { useSelector } from 'react-redux';
import { Game } from '../../types';
import { RootState } from '../../state/rootReducer';

const GameRow = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.user.userInstance);
  const games = useSelector((state: RootState) => state.user.games);

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
        {/* TODO: make sure we have a uniform approach to how we set keys - a lib or just id? */}
        {games.map((game: Game) => (
          // TODO: check if is gm here by looking over game users, finding, checking permission
          <GameIcon name={game.title} path={game.imgpath} userID={user.id} gameID={game.id} key={uid(game)} />
        ))}
      </Box>
    </div>
  );
};
export default GameRow;
