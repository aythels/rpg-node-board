import './nodeview.css';
import { Component, SyntheticEvent } from 'react';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
import {
  // GETgameById,
  // GETnodeById,
  GETsubnodesVisibleToUser,
  // GETuserById,
  GETuserCanEditNode,
  POSTnode,
} from '../../mock-backend';
import { Game, Node, Subnode, User } from '../../types';
import { cloneDeep } from 'lodash';
import { ButtonGroup, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import NodeUserForm from '../NodeUserForm/nodeuserform';
import NodeEditForm from '../NodeEditForm/nodeeditform';
import NodeImageForm from '../NodeImageForm/nodeimageform';
import { Close } from '@mui/icons-material';

interface Props {
  node: Node;
  user: User;
  game: Game;
  closeCallback: (node: Node) => void;
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
    const node = props.node; //GETnodeById(props.nodeId);
    const user = props.user; //GETuserById(props.userId);
    const subnodes = GETsubnodesVisibleToUser(node.id, user.id);
    const game = props.game; //GETgameById(props.gameId);
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
          <Button onClick={() => this.props.closeCallback(this.state.node)}>
            <Close />
          </Button>
        </ButtonGroup>
      );
    } else {
      return <></>;
    }
  };

  saveNodeState = (): void => {
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
    this.handleUsersModalClose();
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
    this.handleEditModalClose();
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
    this.handleImageModalClose();
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
      <div className="nodeview">
        <div className="node-header">
          <div className="node-topline">
            <p>
              {node.name} &#8211; <span className="node__type">{node.type}</span>
            </p>
            {this.renderMenu()}
          </div>
          <img className="node-header-image" src={node.image} alt={node.imageAlt}></img>
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
