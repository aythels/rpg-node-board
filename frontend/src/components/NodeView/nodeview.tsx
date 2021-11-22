import './nodeview.css';
import { FormEvent, SyntheticEvent, useState } from 'react';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { selectActiveNode, setActiveNode, updateNode } from '../../state/slices/gameSlice';
import { setIsEditModalOpen, setIsImageModalOpen, setIsUsersModalOpen } from '../../state/slices/nodeviewSlice';

const NodeView = (): JSX.Element => {
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const user = useSelector((state: RootState) => state.user.userInstance);
  const node = selectActiveNode();
  const isEditModalOpen = useSelector((state: RootState) => state.nodeview.isEditModalOpen);
  const isUsersModalOpen = useSelector((state: RootState) => state.nodeview.isUsersModalOpen);
  const isImageModalOpen = useSelector((state: RootState) => state.nodeview.isImageModalOpen);

  const [newSubnodeName, setNewSubnodeName] = useState('');
  const [newSubnodeType, setNewSubnodeType] = useState('');
  const [newSubnodeInfoLevel, setNewSubnodeInfoLevel] = useState('');

  const dispatch = useDispatch();

  const renderMenu = (): JSX.Element | null => {
    if (node.editors.includes(user.id)) {
      return (
        <ButtonGroup>
          <Tooltip title="Node Info">
            <Button onClick={() => dispatch(setIsEditModalOpen(true))}>
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Node Permissions">
            <Button onClick={() => dispatch(setIsUsersModalOpen(true))}>
              <PeopleAltIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Node Image">
            <Button onClick={() => dispatch(setIsImageModalOpen(true))}>
              <InsertPhotoIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Close">
            <Button onClick={() => dispatch(setActiveNode(-1))}>
              <Close />
            </Button>
          </Tooltip>
        </ButtonGroup>
      );
    } else {
      return (
        <ButtonGroup>
          <Button onClick={() => dispatch(setActiveNode(-1))}>
            <Close />
          </Button>
        </ButtonGroup>
      );
    }
  };

  // const handleUsersFormSubmit = (e: SyntheticEvent, node: Node): void => {
  //   if (!e.defaultPrevented) {
  //     e.preventDefault();
  //   }
  //   dispatch(updateNode(game.id, node));
  //   dispatch(setIsUsersModalOpen(false));
  // };

  // const handleEditFormSubmit = (e: SyntheticEvent, node: Node): void => {
  //   if (!e.defaultPrevented) {
  //     e.preventDefault();
  //   }
  //   dispatch(updateNode(game.id, node));
  //   dispatch(setIsEditModalOpen(false));
  // };

  // const handleImageFormSubmit = (e: SyntheticEvent, node: Node): void => {
  //   if (!e.defaultPrevented) {
  //     e.preventDefault();
  //   }
  //   dispatch(updateNode(game.id, node));
  //   dispatch(setIsImageModalOpen(false));
  // };

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

  const renderSubnodes = (): JSX.Element => {
    return (
      <div className="subnodes">
        {node.subnodes.map((subnode) => (
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

  return (
    <div className="nodeview">
      <div className="node-header">
        <div className="node-topline">
          <p>
            {node.name} &#8211; <span className="node__type">{node.type}</span>
          </p>
          {renderMenu()}
        </div>
        <img className="node-header-image" src={node.image} alt={node.imageAlt}></img>
      </div>
      {isEditModalOpen ? (
        <NodeEditForm
          nodeId={this.state.node.id}
          userId={this.state.user.id}
          gameId={this.state.game.id}
          closeCallback={this.handleEditModalClose}
          submitCallback={this.handleEditFormSubmit}
        />
      ) : null}
      {isUsersModalOpen ? (
        <NodeUserForm
          nodeId={this.state.node.id}
          userId={this.state.user.id}
          gameId={this.state.game.id}
          closeCallback={this.handleUsersModalClose}
          submitCallback={this.handleUsersFormSubmit}
        />
      ) : null}
      {isImageModalOpen ? (
        <NodeImageForm
          nodeId={this.state.node.id}
          userId={this.state.user.id}
          gameId={this.state.game.id}
          closeCallback={this.handleImageModalClose}
          submitCallback={this.handleImageFormSubmit}
        />
      ) : null}
      {renderSubnodes()}
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
};

export default NodeView;
