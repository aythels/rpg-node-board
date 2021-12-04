import './canvasMain.css';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '../Dialog/Dialog';
import RightSidebar from '../RightSidebar';
import CanvasInternal from '../CanvasInternal';
import { GameLoadingStatus, updateDialogStatus } from '../../state/slices/gameSlice';
import { RootState } from '../../state/rootReducer';

const CanvasMain = (): JSX.Element => {
  const showUserNotFoundDialog = useSelector((state: RootState) => state.game.dialogStatus.userNotFound);
  const loadingStatus = useSelector((state: RootState) => state.game.status);
  const dispatch = useDispatch();

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
        open={showUserNotFoundDialog}
        onClose={() => dispatch(updateDialogStatus(['userNotFound', false]))}
      />
    </>
  );
};
export default CanvasMain;
