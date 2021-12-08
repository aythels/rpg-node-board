import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';
import { Game } from '../../types';
import { fetchGame } from '../../state/slices/gameSlice';
import { useDispatch } from 'react-redux';
import { useMemo, useState } from 'react';
import { IconButton, Theme } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
import { removeUserFromGame } from '../../state/slices/userSlice';
import Dialog from '../Dialog/Dialog';

interface Props {
  game: Game;
}

const FALLBACK_IMAGE = '/images/fallbacks/game_icon.jpeg';
export const GameIcon = (props: Props): JSX.Element => {
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();
  const [showRemoveFromGameDialog, setShowRemoveFromGameDialog] = useState(false);

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
      style={{ position: 'relative', boxShadow: '0.1rem 0.1rem 0.7rem', overflow: 'visible' }}
    >
      {/* TODO: remove fetchGame and just use props value instead? */}
      <IconButton
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 2,
          backgroundColor: theme.palette.error.contrastText,
        }}
        color="error"
        aria-label={`Delete game ${props.game.title}`}
        onClick={() => setShowRemoveFromGameDialog(true)}
      >
        <Delete />
      </IconButton>
      <CardActionArea onClick={() => dispatch(fetchGame(props.game._id))} component={Link} to="/canvas">
        <CardMedia component="img" height="100" width="100" image={image} alt="Game Icon" />
        <Typography variant="h5" component="div">
          {props.game.title}
        </Typography>
      </CardActionArea>
      <Dialog
        description="This will remove you from this game."
        header={`Remove game ${props.game.title}?`}
        open={showRemoveFromGameDialog}
        onAgree={() => {
          dispatch(removeUserFromGame(props.game._id));
        }}
        onClose={() => setShowRemoveFromGameDialog(false)}
        onDisagree={() => setShowRemoveFromGameDialog(false)}
      />
    </Card>
  );
};
