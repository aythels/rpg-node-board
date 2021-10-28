import './canvasSidebar.css';
import { Component } from 'react';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Modal from '../Modal/Modal';
import PlayerList from './components/PlayerList/PlayerList';
import { User } from '../../types';

interface Props {
  currentUserId: number;
  onInviteUserClicked: (username: string) => void;
  onRemoveUserClicked: (user: User) => void;
  onSubmitTitleClicked: (newTitle: string) => void;
  onPromoteClicked: (id: number) => void;
  onDemoteClicked: (id: number) => void;
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
      this.props.onInviteUserClicked(username);
    }
  };

  render(): JSX.Element {
    return (
      <div className="sidebar">
        <Header title={this.props.gameTitle} onSubmitTitleClicked={this.props.onSubmitTitleClicked} />
        <PlayerList
          currentUserId={this.props.currentUserId}
          gameMasterIds={this.props.gameMasterIds}
          users={this.props.users}
          onDemoteClicked={this.props.onDemoteClicked}
          onPromoteClicked={this.props.onPromoteClicked}
          onRemoveUserClicked={this.props.onRemoveUserClicked}
        />
        <Footer onInviteUserClicked={this.handleInviteUserClicked} />
        <Modal
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
// - fix colours
// -> make colors semantic - delete button, cancel button in edit

// - highlight personal user bubble?

// - add/check aria labels
// - add tooltips
