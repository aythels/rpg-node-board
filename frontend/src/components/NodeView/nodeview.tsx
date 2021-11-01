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
  POSTnode,
} from '../../mock-backend';
import { Game, Node, Subnode, User } from '../../types';

// MUI Components
import { ButtonGroup, Button } from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import NodeUserForm from '../NodeUserForm/nodeuserform';
import { cloneDeep } from 'lodash';
import NodeEditForm from '../NodeEditForm/nodeeditform';
import NodeImageForm from '../NodeImageForm/nodeimageform';

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

  saveNodeState = (): void => {
    // console.log('Posting', this.state.node);
    POSTnode(this.state.node);
  };

  handleUsersFormSubmit = (e: SyntheticEvent, node: Node): void => {
    if (!e.defaultPrevented) {
      e.preventDefault();
    }
    console.log('Updating permissions for node ' + this.state.node.name);
    this.setState(
      {
        node: cloneDeep(node),
      },
      this.saveNodeState,
    );
  };

  handleEditFormSubmit = (e: SyntheticEvent, node: Node): void => {
    if (!e.defaultPrevented) {
      e.preventDefault();
    }
    console.log('Updating settings for node ' + this.state.node.name);
    this.setState(
      {
        node: cloneDeep(node),
      },
      this.saveNodeState,
    );
  };

  handleImageFormSubmit = (e: SyntheticEvent, node: Node): void => {
    if (!e.defaultPrevented) {
      e.preventDefault();
    }
    console.log('Updating image for node ' + this.state.node.name);
    this.setState(
      {
        node: cloneDeep(node),
      },
      this.saveNodeState,
    );
  };

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
        {this.state.editModalOpen ? (
          <NodeEditForm
            nodeId={this.state.node.id}
            userId={this.state.user.id}
            gameId={this.state.game.id}
            closeCallback={this.handleEditModalClose}
            submitCallback={this.handleEditFormSubmit}
          />
        ) : null}
        {this.state.usersModalOpen ? (
          <NodeUserForm
            nodeId={this.state.node.id}
            userId={this.state.user.id}
            gameId={this.state.game.id}
            closeCallback={this.handleUsersModalClose}
            submitCallback={this.handleUsersFormSubmit}
          />
        ) : null}
        {this.state.imageModalOpen ? (
          <NodeImageForm
            nodeId={this.state.node.id}
            userId={this.state.user.id}
            gameId={this.state.game.id}
            closeCallback={this.handleImageModalClose}
            submitCallback={this.handleImageFormSubmit}
          />
        ) : null}
        {this.renderSubnodes()}
      </div>
    );
  }
}
