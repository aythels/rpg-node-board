import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router-dom';

interface Props {
  name: string;
  path: string;
  isGameMaster: boolean;
}

export const GameIcon = (props: Props): JSX.Element => {
  const imgPath = '/images/' + props.path; // TODO: use server URL
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
      <CardActionArea component={Link} to={props.isGameMaster ? 'canvasAdmin' : 'canvasUser'}>
        <CardMedia component="img" height="100" width="100" src={imgPath} alt="Game Icon" />
        <Typography variant="h5" component="div">
          {props.name}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
