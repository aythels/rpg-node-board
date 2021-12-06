import './nodeview.css';
import { FormEvent, useState } from 'react';
import SubnodeView from '../SubnodeView/subnodeview';
import { uid } from 'react-uid';
import { InfoLevel, Node, Subnode } from '../../types';
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
import { addSubnode, selectActiveNode } from '../../state/slices/gameSlice';
import {
  setIsEditModalOpen,
  setIsImageModalOpen,
  setIsUsersModalOpen,
  setActiveNode,
} from '../../state/slices/nodeviewSlice';

const NodeView = (): JSX.Element => {
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const user = useSelector((state: RootState) => state.user.userInstance);
  const node: Node = useSelector((state: RootState) => selectActiveNode(state));
  const isEditModalOpen = useSelector((state: RootState) => state.nodeview.isEditModalOpen);
  const isUsersModalOpen = useSelector((state: RootState) => state.nodeview.isUsersModalOpen);
  const isImageModalOpen = useSelector((state: RootState) => state.nodeview.isImageModalOpen);

  const [newSubnodeName, setNewSubnodeName] = useState('');
  const [newSubnodeType, setNewSubnodeType] = useState('');
  const [newSubnodeInfoLevel, setNewSubnodeInfoLevel] = useState('');

  const dispatch = useDispatch();

  const renderMenu = (): JSX.Element | null => {
    if (node.editors.includes(user._id)) {
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
            <Button onClick={() => dispatch(setActiveNode(''))}>
              <Close />
            </Button>
          </Tooltip>
        </ButtonGroup>
      );
    } else {
      return (
        <ButtonGroup>
          <Button onClick={() => dispatch(setActiveNode(''))}>
            <Close />
          </Button>
        </ButtonGroup>
      );
    }
  };

  const addNewSubnode = (e: FormEvent): void => {
    e.preventDefault();
    const newSubnode = {
      name: newSubnodeName,
      type: newSubnodeType,
      informationLevel: parseInt(newSubnodeInfoLevel),
      editors: node.editors,
      content: new Delta(),
    };
    dispatch(addSubnode(game._id, node._id, newSubnode));
  };

  const renderSubnodes = (): JSX.Element => {
    return (
      <div className="subnodes">
        {node.subnodes.map((subnode: Subnode) => {
          const infoLevel = node.informationLevels.find((i) => i.userId === user._id) as InfoLevel;
          if (subnode.informationLevel >= infoLevel.infoLevel || node.editors.includes(user._id)) {
            return <SubnodeView subnode={subnode} key={uid(subnode)} />;
          }
        })}
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
      {isEditModalOpen ? <NodeEditForm /> : null}
      {isUsersModalOpen ? <NodeUserForm /> : null}
      {isImageModalOpen ? <NodeImageForm /> : null}
      {renderSubnodes()}
      {node.editors.includes(user._id) ? (
        <div className="new-subnode-wrapper">
          <h2>Add new subnode</h2>
          <form
            className="new-subnode"
            onSubmit={(e) => {
              addNewSubnode(e);
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
              value={newSubnodeName}
              onChange={(event) => {
                setNewSubnodeName(event.target.value);
              }}
            ></TextField>
            <TextField
              required
              label="Type"
              value={newSubnodeType}
              onChange={(event) => {
                setNewSubnodeType(event.target.value);
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
              value={newSubnodeInfoLevel}
              onChange={(event) => {
                setNewSubnodeInfoLevel(event.target.value);
              }}
            ></TextField>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default NodeView;
