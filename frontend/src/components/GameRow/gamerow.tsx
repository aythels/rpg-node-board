import Box from '@mui/material/Box';
import { GameIcon } from '../GameIcon/GameIcon';
import { useSelector } from 'react-redux';
import { Game, UserPermission } from '../../types';
import { RootState } from '../../state/rootReducer';
import { useMemo } from 'react';

const GameRow = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.user.userInstance);
  const games: Game[] = useSelector((state: RootState) => state.user.games);

  const isGameMaster = useMemo(() => {
    const out: { [key: Game['id']]: boolean } = {};
    for (const game of games) {
      const userInGame = game.users.find((u) => u.userId === user.id);
      out[game.id] = userInGame?.permission === UserPermission.gameMaster;
    }
    return out;
  }, [user, games]);

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
          <GameIcon key={game.id} name={game.title} path={game.imgpath} isGameMaster={isGameMaster[game.id]} />
        ))}
      </Box>
    </div>
  );
};
export default GameRow;
