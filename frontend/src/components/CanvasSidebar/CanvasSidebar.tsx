import './canvasSidebar.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
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
}
export default class CanvasSidebar extends Component<Props, State> {
  state: State = {
    showUserAlreadyInGameModal: false,
    sidebarOpen: true,
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

  render(): JSX.Element {
    return (
      <div className="canvas-sidebar">
        <span className="button">
          <IconButton
            aria-label={`${this.state.sidebarOpen ? 'Close' : 'Open'} the sidebar`}
            component="span"
            onClick={() =>
              this.setState((prevState: State) => ({
                sidebarOpen: !prevState.sidebarOpen,
              }))
            }
          >
            {this.state.sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </span>
        <Drawer anchor="right" className="container" open={this.state.sidebarOpen} variant="persistent">
          <CanvasSidebarHeader
            isAdmin={this.props.isAdmin}
            title={this.props.gameTitle}
            onSubmitGameTitleClicked={this.props.onSubmitGameTitleClicked}
          />
          <CanvasSidebarPlayerList
            currentUserId={this.props.currentUserId}
            gameMasterIds={this.props.gameMasterIds}
            isAdmin={this.props.isAdmin}
            users={this.props.users}
            onDemotePlayerClicked={this.props.onDemotePlayerClicked}
            onPromotePlayerClicked={this.props.onPromotePlayerClicked}
            onRemovePlayerClicked={this.props.onRemovePlayerClicked}
          />
          {this.props.isAdmin && <CanvasSidebarFooter onInvitePlayerClicked={this.handleInviteUserClicked} />}
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
