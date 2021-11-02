import './canvasSidebar.css';
import CanvasSidebarFooter from '../CanvasSidebarFooter/CanvasSidebarFooter';
import CanvasSidebarHeader from '../CanvasSidebarHeader/CanvasSidebarHeader';
import { Component } from 'react';
import Dialog from '../Dialog/Dialog';

import PlayerList from '../CanvasSidebarPlayerList/CanvasSidebarPlayerList';
import { User } from '../../types';

interface Props {
  currentUserId: number;
  onInvitePlayerClicked: (username: string) => void;
  onRemovePlayerClicked: (user: User) => void;
  onSubmitGameTitleClicked: (newTitle: string) => void;
  onPromotePlayerClicked: (id: number) => void;
  onDemotePlayerClicked: (id: number) => void;
  users: User[];
  gameTitle: string;
  gameMasterIds: number[];
}

interface State {
  showUserAlreadyInGameModal: boolean;
}
export default class CanvasSidebar extends Component<Props, State> {
  state: State = {
    showUserAlreadyInGameModal: false,
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
      <div className="canvas-sidebar__wrapper">
        <CanvasSidebarHeader
          title={this.props.gameTitle}
          onSubmitGameTitleClicked={this.props.onSubmitGameTitleClicked}
        />
        <PlayerList
          currentUserId={this.props.currentUserId}
          gameMasterIds={this.props.gameMasterIds}
          users={this.props.users}
          onDemotePlayerClicked={this.props.onDemotePlayerClicked}
          onPromotePlayerClicked={this.props.onPromotePlayerClicked}
          onRemovePlayerClicked={this.props.onRemovePlayerClicked}
        />
        <CanvasSidebarFooter onInvitePlayerClicked={this.handleInviteUserClicked} />
        <Dialog
          description="You cannot add the same user twice."
          header="This user is already in the game!"
          open={this.state.showUserAlreadyInGameModal}
          onClose={() => this.setState({ showUserAlreadyInGameModal: false })}
        />
      </div>
    );
  }
}

// TODO:
// - discuss invite text field:
// 1. type name
// 2. press search icon
// 3. text field changes into dropdown
// 4. press add icon

// - add at least one profile picture
// - add collapse sidebar button
// - add user view
// - tooltips
// - aria labels

// - remove delete server button
// - add MUI theme
// - clean up types
// - replace filter with find
// - all @type declarations should be *development* dependencies

// - read enter for submit in textfield?
