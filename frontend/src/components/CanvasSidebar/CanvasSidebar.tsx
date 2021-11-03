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
    sidebarOpen: true,
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
        <span className="button">
          <IconButton
            aria-label={`${this.state.sidebarOpen ? 'Close' : 'Open'} the sidebar`}
            component="span"
            onClick={this.toggleSidebarOpen}
          >
            {this.state.sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </span>
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
            isAdmin={this.state.settingsOpen}
            title={this.props.gameTitle}
            onSubmitGameTitleClicked={this.props.onSubmitGameTitleClicked}
          />
          <CanvasSidebarPlayerList
            currentUserId={this.props.currentUserId}
            gameMasterIds={this.props.gameMasterIds}
            isAdmin={this.state.settingsOpen}
            users={this.props.users}
            onDemotePlayerClicked={this.props.onDemotePlayerClicked}
            onPromotePlayerClicked={this.props.onPromotePlayerClicked}
            onRemovePlayerClicked={this.props.onRemovePlayerClicked}
          />
          {this.state.settingsOpen && <CanvasSidebarFooter onInvitePlayerClicked={this.handleInviteUserClicked} />}
          <Dialog
            description="You cannot add the same user twice."
            header="This user is already in the game!"
            open={this.state.showUserAlreadyInGameModal}
            onClose={() => this.setState({ showUserAlreadyInGameModal: false })}
          />
        </Drawer>
      </div>
    );
  }
}
