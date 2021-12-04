import './canvasMain.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Dialog from '../Dialog/Dialog';
import RightSidebar from '../RightSidebar';
import CanvasInternal from '../CanvasInternal';
import { GameLoadingStatus } from '../../state/slices/gameSlice';
import { RootState } from '../../state/rootReducer';

const CanvasMain = (): JSX.Element => {
  const [showUserNotFoundModal, setShowUserNotFoundModal] = useState(false);
  const loadingStatus = useSelector((state: RootState) => state.game.status);

  return loadingStatus === GameLoadingStatus.Loading ? (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      style={{ minHeight: '100vh' }}
    >
      <Grid item>
        <CircularProgress />
      </Grid>
      <Grid item>
        <Typography variant="body1">Loading game</Typography>
      </Grid>
    </Grid>
  ) : (
    <>
      {/* TODO: put back  */}
      {/* <CanvasInternal /> */}
      <RightSidebar />
      <Dialog
        description="Please try again."
        header="The player could not be found!"
        open={showUserNotFoundModal}
        onClose={() => setShowUserNotFoundModal(false)}
      />
    </>
  );
};
export default CanvasMain;
