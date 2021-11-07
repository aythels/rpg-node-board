import './canvasSidebar.css';
import { ChevronLeft, ChevronRight, Settings } from '@mui/icons-material';
import { Drawer, IconButton, Tooltip } from '@mui/material';
import CanvasSidebarFooter from '../CanvasSidebarFooter/CanvasSidebarFooter';
import CanvasSidebarHeader from '../CanvasSidebarHeader/CanvasSidebarHeader';
import CanvasSidebarPlayerList from '../CanvasSidebarPlayerList/CanvasSidebarPlayerList';
import { Component } from 'react';
import Dialog from '../Dialog/Dialog';
import { User } from '../../types';

interface Props {
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
export default class CanvasSidebar extends Component<Props, State> {
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

  render(): JSX.Element {
    return (
      <div className="canvas-sidebar">
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
          {this.props.isAdmin && (
            <div className="navbar">
              {this.state.settingsOpen ? (
                <Tooltip arrow placement="left" title="Close game settings">
                  <IconButton
                    aria-label="Close game settings"
                    component="span"
                    className="temp"
                    onClick={() => this.setState({ settingsOpen: false })}
                  >
                    <ChevronLeft />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip arrow placement="left" title="Open game settings">
                  <IconButton
                    aria-label="Open game settings"
                    component="span"
                    className="temp"
                    onClick={() => this.setState({ settingsOpen: true })}
                  >
                    <Settings />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
          <CanvasSidebarHeader
            exposeSettings={this.state.settingsOpen}
            title={this.props.gameTitle}
            onSubmitGameTitleClicked={this.props.onSubmitGameTitleClicked}
          />
          <CanvasSidebarPlayerList
            currentUserId={this.props.currentUserId}
            gameMasterIds={this.props.gameMasterIds}
            exposeSettings={this.state.settingsOpen}
            users={this.props.users}
            onDemotePlayerClicked={this.props.onDemotePlayerClicked}
            onPromotePlayerClicked={this.props.onPromotePlayerClicked}
            onRemovePlayerClicked={this.props.onRemovePlayerClicked}
          />
          {this.state.settingsOpen && (
            <CanvasSidebarFooter onInvitePlayerClicked={this.handleInviteUserClicked} gameId={this.props.gameId} />
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
