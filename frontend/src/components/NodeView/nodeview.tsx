import './nodeview.css';
import { Component, FormEvent, SyntheticEvent } from 'react';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
import {
  GETnewSubnodeId,
  // GETgameById,
  // GETnodeById,
  GETsubnodesVisibleToUser,
  // GETuserById,
  GETuserCanEditNode,
  POSTnode,
  POSTsubnode,
} from '../../mock-backend';
import { Game, Node, Subnode, User } from '../../types';
import { cloneDeep } from 'lodash';
import { ButtonGroup, Button, TextField, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import NodeUserForm from '../NodeUserForm/nodeuserform';
import NodeEditForm from '../NodeEditForm/nodeeditform';
import NodeImageForm from '../NodeImageForm/nodeimageform';
import { Add, Close } from '@mui/icons-material';
import Delta from 'quill-delta';

interface Props {
  node: Node;
  user: User;
  game: Game;
  closeCallback: (node: Node) => void;
  onLinkClick: (id: number, node: Node) => void;
}

interface State {
  node: Node;
  user: User;
  game: Game;
  subnodes: Subnode[];
  editModalOpen: boolean;
  usersModalOpen: boolean;
  imageModalOpen: boolean;
  newSubnodeName: string;
  newSubnodeType: string;
  newSubnodeInfoLevel: string;
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
      newSubnodeName: '',
      newSubnodeType: '',
      newSubnodeInfoLevel: '',
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
      return (
        <ButtonGroup>
          <Button onClick={() => this.props.closeCallback(this.state.node)}>
            <Close />
          </Button>
        </ButtonGroup>
      );
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

  addNewSubnode = (e: FormEvent): void => {
    e.preventDefault();
    POSTsubnode({
      id: GETnewSubnodeId(),
      node_id: this.state.node.id,
      name: this.state.newSubnodeName,
      type: this.state.newSubnodeType,
      informationLevel: parseInt(this.state.newSubnodeInfoLevel),
      editors: this.state.node.editors,
      content: new Delta(),
    });
    this.setState({
      subnodes: GETsubnodesVisibleToUser(this.state.node.id, this.state.user.id),
    });
  };

  renderSubnodes = (): JSX.Element => {
    const subnodes = this.state.subnodes;
    return (
      <div className="subnodes">
        {subnodes.map((subnode) => (
          <SubnodeView
            subnode={subnode}
            game={this.props.game}
            node={this.state.node}
            user={this.state.user}
            key={uid(subnode)}
            onLinkClick={this.props.onLinkClick}
          />
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
        {GETuserCanEditNode(this.state.user.id, this.state.node.id) ? (
          <div className="new-subnode-wrapper">
            <h2>Add new subnode</h2>
            <form
              className="new-subnode"
              onSubmit={(e) => {
                this.addNewSubnode(e);
              }}
            >
              <Tooltip title="Add new subnode">
                <Button type="submit">
                  <Add />
                </Button>
              </Tooltip>
              <TextField
                required
                label="Name"
                value={this.state.newSubnodeName}
                onChange={(event) => {
                  this.setState({ newSubnodeName: event.target.value });
                }}
              ></TextField>
              <TextField
                required
                label="Type"
                value={this.state.newSubnodeType}
                onChange={(event) => {
                  this.setState({ newSubnodeType: event.target.value });
                }}
              ></TextField>
              <TextField
                required
                type="number"
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 1,
                  },
                }}
                label="Information Level"
                value={this.state.newSubnodeInfoLevel}
                onChange={(event) => {
                  this.setState({ newSubnodeInfoLevel: event.target.value });
                }}
              ></TextField>
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}
