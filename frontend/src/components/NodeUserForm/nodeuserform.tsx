import { SyntheticEvent, useState } from 'react';
import { InfoLevel, Node, User } from '../../types';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Add, Close, DeleteForever, SaveRounded } from '@mui/icons-material';
import './nodeuserform.css';
import { uid } from 'react-uid';
import { RootState } from '../../state/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveNode, updateNode } from '../../state/slices/gameSlice';
import cloneDeep from 'lodash.clonedeep';
import { GETuserById, GETuserIsGMInGame } from '../../mock-backend';
import { setIsUsersModalOpen } from '../../state/slices/nodeviewSlice';

const NodeUserForm = (): JSX.Element => {
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const node: Node = useSelector((state: RootState) => selectActiveNode(state));
  const dispatch = useDispatch();

  const [addEditorAnchorEl, setAddEditorAnchorEl] = useState(null as EventTarget | null);
  const [tempNode, setTempNode] = useState(cloneDeep(node) as Node);

  const handleModalClick = (e: SyntheticEvent): void => {
    const target = e.target as HTMLElement;
    if (target.className == 'modal') {
      dispatch(setIsUsersModalOpen(false));
    }
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(updateNode(game._id, tempNode)); // TODO: async?
    dispatch(setIsUsersModalOpen(false));
  };

  const removeEditor = (editorToRemove: User): void => {
    // console.log(editorToRemove);
    tempNode.editors = tempNode.editors.filter((e) => e !== editorToRemove._id);
    const infoLevels = tempNode.informationLevels;
    const infoLevel = infoLevels.find((i) => i.userId === editorToRemove._id) as InfoLevel;
    infoLevel.infoLevel = 0;
    setTempNode({
      ...tempNode,
    });
  };

  const getMaxInfoLevel = (): number => {
    let max = 0;
    for (const subnode of node.subnodes) {
      max = subnode.informationLevel > max ? subnode.informationLevel : max;
    }
    return max;
  };

  const addEditor = (playerToAdd: User): void => {
    tempNode.editors.push(playerToAdd._id);
    const infoLevels = tempNode.informationLevels;
    const infoLevel = infoLevels.find((i) => i.userId === playerToAdd._id) as InfoLevel;
    infoLevel.infoLevel = getMaxInfoLevel();
    setTempNode({
      ...tempNode,
      // informationLevels: infoLevels,
    });
  };

  const handleInformationLevelChange = (e: SyntheticEvent, player: User): void => {
    const target = e.target as HTMLInputElement;
    const infoLevel = tempNode.informationLevels.find((i) => i.userId == player._id) as InfoLevel;
    infoLevel.infoLevel = parseInt(target.value);
    setTempNode({ ...tempNode });
  };

  const informationLevelHideAll = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.userId)) {
        infoLevel.infoLevel = 0;
      }
    }
    setTempNode({ ...tempNode });
  };

  const informationLevelAllPlusOne = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.userId)) {
        infoLevel.infoLevel++;
      }
    }
    setTempNode({ ...tempNode });
  };

  const informationLevelAllMinusOne = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.userId)) {
        infoLevel.infoLevel--;
      }
    }
    setTempNode({ ...tempNode });
  };

  const informationLevelRevealAll = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.userId)) {
        infoLevel.infoLevel = getMaxInfoLevel();
      }
    }
    setTempNode({ ...tempNode });
  };

  const openNewEditorMenu = (e: SyntheticEvent): void => {
    const target = e.currentTarget;
    setAddEditorAnchorEl(target);
  };

  const closeNewEditorMenu = (): void => {
    setAddEditorAnchorEl(null);
  };

  const getInfoLevelValue = (playerId: User['_id']): string => {
    const infoLevel = tempNode.informationLevels.find((i) => i.userId === playerId) as InfoLevel;
    if (infoLevel) {
      return infoLevel.infoLevel.toString();
    } else {
      return '0';
    }
  };

  const renderVisibleSubnodeNames = (playerId: User['_id']): JSX.Element => {
    const infoLevel = tempNode.informationLevels.find((i) => i.userId === playerId) as InfoLevel;
    console.log(playerId, infoLevel);
    const visibleSubnodes = tempNode.editors.includes(playerId)
      ? tempNode.subnodes
      : tempNode.subnodes.filter((subnode) => subnode.informationLevel <= infoLevel.infoLevel);
    return (
      <TableCell align="right">
        {visibleSubnodes.map((subnode) => {
          return <span key={uid(subnode)}>{subnode.name}, </span>;
        })}
      </TableCell>
    );
  };

  // TODO: Make table responsive for mobile

  return (
    <div className="modal custom-modal nodeuserform" onClick={handleModalClick}>
      <form onSubmit={handleSubmit} className="modal-content-wrapper">
        <div className="modal__body">
          <div className="modal__body__section">
            <h4>Editors</h4>
            <div className="users-box">
              {game.users.map((entry) => {
                // TODO: Use user style from sidebar
                if (tempNode.editors.includes(entry.userId)) {
                  const editor = GETuserById(entry.userId); // TODO: use Redux for this
                  return (
                    <div className="users-box__user" key={uid(editor)}>
                      <p>{editor.username}</p>
                      <button
                        aria-label="Remove user as editor"
                        disabled={GETuserIsGMInGame(editor._id, game._id)}
                        onClick={() => {
                          removeEditor(editor);
                        }}
                      >
                        <Close />
                      </button>
                    </div>
                  );
                }
              })}
              <IconButton
                aria-label="Add new editor"
                onClick={(e) => {
                  openNewEditorMenu(e);
                }}
              >
                <Add />
              </IconButton>
              <Menu
                className="nodeview-menu-popup"
                anchorEl={addEditorAnchorEl as Element}
                open={Boolean(addEditorAnchorEl)}
                onClose={closeNewEditorMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {game.users.map((entry) => {
                  if (!tempNode.editors.includes(entry.userId)) {
                    const player = GETuserById(entry.userId); // TODO: use Redux for this
                    return (
                      <MenuItem key={uid(player)}>
                        <div className="users-box__user">
                          <button
                            onClick={() => {
                              addEditor(player);
                            }}
                          >
                            <p>{player.username}</p>
                          </button>
                        </div>
                      </MenuItem>
                    );
                  }
                })}
              </Menu>
            </div>
          </div>
          <div className="modal__body__section">
            <h4 className="no-bottom-margin">Player Familiarities</h4>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Username</TableCell>
                  <TableCell align="right">Information Level</TableCell>
                  <TableCell align="right">Visible Subnodes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {game.users.map((entry) => {
                  if (!tempNode.editors.includes(entry.userId)) {
                    const player = GETuserById(entry.userId); // TODO: Redux
                    return (
                      <TableRow key={uid(player)}>
                        <TableCell align="left" component="th" scope="row">
                          {player.username}
                        </TableCell>
                        <TableCell align="right">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={getInfoLevelValue(player._id)}
                            onChange={(event) => {
                              handleInformationLevelChange(event, player);
                            }}
                          ></input>
                        </TableCell>
                        {renderVisibleSubnodeNames(player._id)}
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
            <div className="button-group">
              <Button onClick={informationLevelHideAll}>Hide All</Button>
              <Button onClick={informationLevelAllMinusOne}>All -1</Button>
              <Button onClick={informationLevelAllPlusOne}>All +1</Button>
              <Button onClick={informationLevelRevealAll}>Reveal All</Button>
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <div>
            <Tooltip title="Discard Changes">
              <Button color="error" variant="contained" onClick={() => dispatch(setIsUsersModalOpen(false))}>
                <DeleteForever />
              </Button>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Save Changes">
              <Button type="submit" variant="contained" color="success">
                <SaveRounded />
              </Button>
            </Tooltip>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NodeUserForm;
