import './nodeview.css';
import { Component, SyntheticEvent } from 'react';
// import ReactQuill from 'react-quill';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
import {
  GETgameById,
  GETnodeById,
  GETsubnodesVisibleToUser,
  GETuserById,
  GETuserCanEditNode,
} from '../../mock-backend';
import { Game, Node, Subnode, User } from '../../types';

// MUI Components
import { ButtonGroup, Button } from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import NodeUserForm from '../NodeUserForm/nodeuserform';

interface Props {
  nodeId: number;
  userId: number;
  gameId: number;
}

interface State {
  node: Node;
  user: User;
  game: Game;
  subnodes: Subnode[];
  editModalOpen: boolean;
  usersModalOpen: boolean;
  imageModalOpen: boolean;
}

export default class NodeView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const node = GETnodeById(props.nodeId);
    const user = GETuserById(props.userId);
    const subnodes = GETsubnodesVisibleToUser(props.nodeId, props.userId);
    const game = GETgameById(props.gameId);
    this.state = {
      node: node,
      user: user,
      game: game,
      subnodes: subnodes,
      editModalOpen: false,
      usersModalOpen: false,
      imageModalOpen: false,
    };
  }

  renderSubnodes = (): JSX.Element => {
    const subnodes = this.state.subnodes;
    return (
      <div className="subnodes">
        {subnodes.map((subnode) => (
          <SubnodeView subnode={subnode} user={this.state.user} key={uid(subnode)} />
        ))}
      </div>
    );
  };

  handleEditModalOpen = (): void => {
    this.setState({
      editModalOpen: true,
    });
  };

  handleUsersModalOpen = (): void => {
    this.setState({
      usersModalOpen: true,
    });
  };

  handleImageModalOpen = (): void => {
    this.setState({
      imageModalOpen: true,
    });
  };

  handleEditModalClose = (): void => {
    this.setState({
      editModalOpen: false,
    });
  };

  handleUsersModalClose = (): void => {
    this.setState({
      usersModalOpen: false,
    });
  };

  handleImageModalClose = (): void => {
    this.setState({
      imageModalOpen: false,
    });
  };

  renderMenu = (): JSX.Element | null => {
    if (GETuserCanEditNode(this.state.user.id, this.state.node.id)) {
      // It might be a good idea to make editability a state variable
      return (
        <ButtonGroup>
          <Button onClick={this.handleEditModalOpen}>
            <EditIcon />
          </Button>
          <Button onClick={this.handleUsersModalOpen}>
            <PeopleAltIcon />
          </Button>
          <Button onClick={this.handleImageModalOpen}>
            <InsertPhotoIcon />
          </Button>
        </ButtonGroup>
      );
    } else {
      return <></>;
    }
  };

  handleUsersFormSubmit = (e: SyntheticEvent): void => {
    if (!e.defaultPrevented) {
      e.preventDefault();
    }
    console.log('(not actually) Updating permissions for node ' + this.state.node.name);
    // const target = e.target as HTMLElement;
    this.handleUsersModalClose();
  };

  render(): JSX.Element {
    const node = this.state.node;
    return (
      <div className="node">
        <div className="node-header">
          <div className="node-topline">
            <p>
              {node.name} &#8211; <span className="node__type">{node.type}</span>
            </p>
            {this.renderMenu()}
          </div>
          <img className="node-header-image" src={node.image} alt="sky"></img>
        </div>
        {/* <Modal
          open={this.state.editModalOpen}
          onClose={this.handleEditModalClose}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <p>EDIT MODAL</p>
        </Modal> */}

        {this.state.usersModalOpen ? (
          <NodeUserForm
            nodeId={this.state.node.id}
            userId={this.state.user.id}
            gameId={this.state.game.id}
            closeCallback={this.handleUsersModalClose}
            submitCallback={this.handleUsersFormSubmit}
          />
        ) : null}

        {/* <Modal
          open={this.state.imageModalOpen}
          onClose={this.handleImageModalClose}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <input type="file"></input>
        </Modal> */}
        {this.renderSubnodes()}
      </div>
    );
  }
}
