import './footer.css';
import { Button, TextField, IconButton, Tooltip } from '@mui/material';
import { ChangeEvent, Component } from 'react';
import { Delete, PersonAdd } from '@mui/icons-material';
import Dialog from '../../Dialog/Dialog';
import { DELETEGame } from '../../../mock-backend';
import { connect } from 'react-redux';
import { addPlayer, hideUserAlreadyAddedDialog } from '../../../state/slices/gameSlice';
import { RootState } from '../../../state/rootReducer';

interface ExternalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addPlayer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hideUserAlreadyAddedDialog: any;
}

interface ReduxProps {
  gameId: number;
  showUserAlreadyAddedDialog: boolean;
}

interface Props extends ExternalProps, ReduxProps {}

interface State {
  inviteName: string;
  showDeleteServerDialog: boolean;
}

class FooterBase extends Component<Props, State> {
  state: State = {
    inviteName: '',
    showDeleteServerDialog: false,
  };

  handleInviteNameChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inviteName: event.target.value });
  };

  render(): JSX.Element {
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
            value={this.state.inviteName}
            variant="outlined"
            onChange={this.handleInviteNameChanged}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                this.props.addPlayer(this.state.inviteName);
              }
            }}
          />
          <Tooltip arrow title="Invite player">
            <IconButton
              aria-label="Invite player to the game"
              component="span"
              disabled={!this.state.inviteName}
              onClick={() => this.props.addPlayer(this.state.inviteName)}
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
          onClick={() => this.setState({ showDeleteServerDialog: true })}
        >
          Delete Game
        </Button>

        <Dialog
          description="Doing so will immediately end the session and remove the game from the server."
          header="Delete server?"
          open={this.state.showDeleteServerDialog}
          onAgree={() => {
            DELETEGame(this.props.gameId);
          }}
          onAgreeRedirectTo="/gamesAdmin"
          onClose={() => this.setState({ showDeleteServerDialog: false })}
          onDisagree={() => this.setState({ showDeleteServerDialog: false })}
        />
        <Dialog
          description="You cannot add the same player twice."
          header="This player is already in the game!"
          open={this.props.showUserAlreadyAddedDialog}
          onClose={() => this.props.hideUserAlreadyAddedDialog()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
  gameId: state.game.gameInstance.id,
  showUserAlreadyAddedDialog: state.game.showUserAlreadyAddedDialog,
});

export default connect(mapStateToProps, { addPlayer, hideUserAlreadyAddedDialog })(FooterBase);
