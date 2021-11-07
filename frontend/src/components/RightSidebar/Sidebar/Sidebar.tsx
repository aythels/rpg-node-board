import './sidebar.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PlayerList from '../PlayerList/PlayerList';
import { Component } from 'react';
import Dialog from '../../Dialog/Dialog';
import { User } from '../../../types';
import { MuiTheme } from '../../../theme';
import { withTheme } from '@mui/styles';

interface Props extends MuiTheme {
  currentUserId: number;
  isAdmin: boolean;
  onInvitePlayerClicked: (username: string) => void;
  onRemovePlayerClicked: (id: number) => void;
  onSubmitGameTitleClicked: (newTitle: string) => void;
  onPromotePlayerClicked: (id: number) => void;
  onDemotePlayerClicked: (id: number) => void;
  gameId: number;
  users: User[];
  gameTitle: string;
  gameMasterIds: number[];
}

interface State {
  showUserAlreadyInGameModal: boolean;
  sidebarOpen: boolean;
  settingsOpen: boolean;
}
class Sidebar extends Component<Props, State> {
  state: State = {
    showUserAlreadyInGameModal: false,
    sidebarOpen: false,
    settingsOpen: false,
  };

  handleInviteUserClicked = (username: string): void => {
    const alreadyAdded = this.props.users.find((user: User) => user.username === username);
    if (alreadyAdded) {
      this.setState({
        showUserAlreadyInGameModal: true,
      });
    } else {
      this.props.onInvitePlayerClicked(username);
    }
  };

  toggleSidebarOpen = (): void => {
    this.setState((prevState: State) => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  toggleSettingsOpen = (): void => {
    this.setState((prevState: State) => ({
      settingsOpen: !prevState.settingsOpen,
    }));
  };

  render(): JSX.Element {
    return (
      <div className="canvas-sidebar" style={{ backgroundColor: this.props.theme.palette.primary }}>
        <IconButton
          className="open-close-button"
          style={{
            right: this.state.sidebarOpen ? '20%' : '0%',
          }}
          aria-label={`${this.state.sidebarOpen ? 'Close' : 'Open'} the sidebar`}
          component="span"
          onClick={this.toggleSidebarOpen}
        >
          {this.state.sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        <Drawer anchor="right" className="container" open={this.state.sidebarOpen} variant="persistent">
          <Header
            isAdmin={this.props.isAdmin}
            exposeSettings={this.state.settingsOpen}
            title={this.props.gameTitle}
            onSettingsToggleClicked={this.toggleSettingsOpen}
            onSubmitGameTitleClicked={this.props.onSubmitGameTitleClicked}
          />
          <PlayerList
            currentUserId={this.props.currentUserId}
            gameMasterIds={this.props.gameMasterIds}
            exposeSettings={this.state.settingsOpen}
            users={this.props.users}
            onDemotePlayerClicked={this.props.onDemotePlayerClicked}
            onPromotePlayerClicked={this.props.onPromotePlayerClicked}
            onRemovePlayerClicked={this.props.onRemovePlayerClicked}
          />
          {this.state.settingsOpen && (
            <Footer onInvitePlayerClicked={this.handleInviteUserClicked} gameId={this.props.gameId} />
          )}
          <Dialog
            description="You cannot add the same player twice."
            header="This player is already in the game!"
            open={this.state.showUserAlreadyInGameModal}
            onClose={() => this.setState({ showUserAlreadyInGameModal: false })}
          />
        </Drawer>
      </div>
    );
  }
}

export default withTheme(Sidebar);
