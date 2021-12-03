import './footer.css';
import { Button, TextField, IconButton, Tooltip } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import Dialog from '../../Dialog/Dialog';
import { DELETEGame } from '../../../mock-backend';
import { useSelector, useDispatch } from 'react-redux';
import { addPlayer, hideUserAlreadyAddedDialog } from '../../../state/slices/gameSlice';
import { RootState } from '../../../state/rootReducer';

const Footer = (): JSX.Element => {
  const dispatch = useDispatch();

  const [inviteName, setInviteName] = useState('');
  const [showDeleteServerDialog, setShowDeleteServerDialog] = useState(false);
  const gameId = useSelector((state: RootState) => state.game.gameInstance._id);
  const showUserAlreadyAddedDialog = useSelector((state: RootState) => state.game.showUserAlreadyAddedDialog);

  const handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    setInviteName(event.target.value);
  };

  return (
    <div className="canvas-sidebar-footer">
      <div className="text-field__wrapper">
        <TextField
          style={{
            color: '#000 !important',
          }}
          fullWidth
          autoComplete="off"
          color="primary"
          id="outlined-basic"
          label="Enter player name"
          value={inviteName}
          variant="outlined"
          onChange={handleInviteNameChanged}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              dispatch(addPlayer(inviteName));
            }
          }}
        />
        <Tooltip arrow title="Invite player">
          <IconButton
            aria-label="Invite player to the game"
            component="span"
            disabled={!inviteName}
            onClick={() => dispatch(addPlayer(inviteName))}
          >
            <PersonAdd />
          </IconButton>
        </Tooltip>
      </div>
      <Button
        fullWidth
        color="error"
        aria-label="delete game server"
        className="delete-button"
        startIcon={<Delete />}
        variant="contained"
        onClick={() => setShowDeleteServerDialog(true)}
      >
        Delete Game
      </Button>

      <Dialog
        description="Doing so will immediately end the session and remove the game from the server."
        header="Delete server?"
        open={showDeleteServerDialog}
        onAgree={() => {
          DELETEGame(gameId);
        }}
        onAgreeRedirectTo="/games"
        onClose={() => setShowDeleteServerDialog(false)}
        onDisagree={() => setShowDeleteServerDialog(false)}
      />
      <Dialog
        description="You cannot add the same player twice."
        header="This player is already in the game!"
        open={showUserAlreadyAddedDialog}
        onClose={() => dispatch(hideUserAlreadyAddedDialog())}
      />
    </div>
  );
};

export default Footer;
