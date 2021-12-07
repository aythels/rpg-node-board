import './userDashboard.css';
import { Grid, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import GameRow from '../GameRow/GameRow';
import { Link } from 'react-router-dom';

const UserDashboard = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.user.userInstance);

  return (
    <div className="padded_div">
      <div
        className="dashboard-background"
        style={{
          zIndex: -1,
          position: 'absolute',
          width: `100vw`,
          height: `100vh`,
          backgroundColor: `white`,
          opacity: `0.5`,
          backgroundImage: `linear-gradient(#d2d3e1 4.4px, transparent 4.4px),
            linear-gradient(90deg, #d2d3e1 4.4px, transparent 4.4px), linear-gradient(#d2d3e1 2.2px, transparent 2.2px),
            linear-gradient(90deg, #d2d3e1 2.2px, #ffffff 2.2px)`,
          backgroundSize: `110px 110px, 110px 110px, 22px 22px, 22px 22px`,
          backgroundPosition: `-4.4px -4.4px, -4.4px -4.4px, -2.2px -2.2px, -2.2px -2.2px`,
        }}
      />
      <Grid
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Grid
          item
          style={{
            position: 'absolute',
            margin: '1rem',
            top: '0',
            right: '0',
          }}
        >
          <Tooltip title="Account Settings" placement="left">
            <Link style={{ textDecoration: 'none' }} to="/settings">
              <IconButton color="primary">
                <SettingsIcon sx={{ fontSize: '4rem' }} />
              </IconButton>
            </Link>
          </Tooltip>
        </Grid>
        <Grid
          item
          container
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            display: 'flex',
            gap: '1rem',
            transform: 'translate(-50%, -70%)',
          }}
        >
          <Typography
            variant="h3"
            style={{
              fontStyle: 'italic',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <b>{user.username}</b>&apos;s games
          </Typography>
          <GameRow />
        </Grid>
      </Grid>
    </div>
  );
};

export default UserDashboard;
