/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sort-imports */
import { Game } from '../../types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';

interface GameDisplayProps {
  name: string;
  path: string;
  userID: number;
  gameID: number;
}
// TODO make it so that the correct game id is put into the link to canvas for some given game
// eslint-disable-next-line react/prop-types
export const GameIcon: React.FunctionComponent<GameDisplayProps> = ({ name, path, userID, gameID }) => {
  const img_path = '/images/' + path;
  console.log(img_path);
  return (
    <Card
      sx={{
        width: 120,
        height: 120,
        p: 2,
        m: 1,
        textAlign: 'center',
      }}
    >
      <CardActionArea component={Link} to={'/canvas'}>
        <CardMedia component="img" height="100" width="100" src={img_path} alt="Game Icon" />
        <Typography variant="h5" component="div">
          {name}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
