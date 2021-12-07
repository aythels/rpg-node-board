import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';
import { Game } from '../../types';
import { fetchGame } from '../../state/slices/gameSlice';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

interface Props {
  game: Game;
}

const FALLBACK_IMAGE = '/images/fallbacks/game_icon.jpeg';
export const GameIcon = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const image = useMemo(() => props.game.image || FALLBACK_IMAGE, [props.game.image]);

  return (
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
      {/* TODO: remove fetchGame and just use props value instead? */}
      <CardActionArea onClick={() => dispatch(fetchGame(props.game._id))} component={Link} to="/canvas">
        <CardMedia component="img" height="100" width="100" image={image} alt="Game Icon" />
        <Typography variant="h5" component="div">
          {props.game.title}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
