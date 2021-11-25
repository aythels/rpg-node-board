import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';
import { Game } from '../../types';
import { fetchGame } from '../../state/slices/gameSlice';
import { useDispatch } from 'react-redux';

interface Props {
  game: Game;
}

export const GameIcon = (props: Props): JSX.Element => {
  const dispatch = useDispatch();

  const imgPath = '/images/' + props.game.imgpath; // TODO: use server URL

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
      <CardActionArea onClick={() => dispatch(fetchGame(props.game.id))} component={Link} to="/canvas">
        <CardMedia component="img" height="100" width="100" src={imgPath} alt="Game Icon" />
        <Typography variant="h5" component="div">
          {props.game.title}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
