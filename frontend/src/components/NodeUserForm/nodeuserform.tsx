import { Component, SyntheticEvent, useState } from 'react';
import { Game, InfoLevel, Node, Subnode, User } from '../../types';
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
import { GETuserIsGMInGame } from '../../mock-backend';
import { setIsEditModalOpen, setIsUsersModalOpen } from '../../state/slices/nodeviewSlice';

// interface Props {
//   gameId: number;
//   nodeId: number;
//   userId: number;
//   closeCallback: () => void;
//   // eslint-disable-next-line no-unused-vars
//   submitCallback: (arg0: SyntheticEvent, arg1: Node) => void;
// }

// interface State {
//   game: Game;
//   node: Node;
//   user: User;
//   subnodes: Subnode[];
//   closeCallback: () => void;
//   // eslint-disable-next-line no-unused-vars
//   submitCallback: (arg0: SyntheticEvent, arg1: Node) => void;
//   editors: User[];
//   players: User[];
//   addEditorAnchorEl: EventTarget | null;
// }

const NodeUserForm = (): JSX.Element => {
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const user = useSelector((state: RootState) => state.user.userInstance);
  const node = selectActiveNode();
  const [tempNode, setTempNode] = useState(cloneDeep(node) as Node);
  const dispatch = useDispatch();
  const [addEditorAnchorEl, setAddEditorAnchorEl] = useState(null as EventTarget | null);
  // constructor(props: Props) {
  //   super(props);
  //   const game = GETgameById(props.gameId);
  //   const node = GETnodeById(props.nodeId);
  //   const user = GETuserById(props.userId);
  //   const subnodes = GETsubnodesByNodeId(node.id);
  //   const editors = GETeditorsForNode(node.id);
  //   const players = GETplayersInGame(game.id);
  //   const editorIds = editors.map((editor) => editor.id);
  //   this.state = {
  //     game: game,
  //     node: node,
  //     user: user,
  //     subnodes: subnodes,
  //     closeCallback: props.closeCallback,
  //     submitCallback: props.submitCallback,
  //     editors: editors,
  //     players: players.filter((player) => !editorIds.includes(player.id)),
  //     addEditorAnchorEl: null,
  //   };
  // }

  const handleModalClick = (e: SyntheticEvent): void => {
    const target = e.target as HTMLElement;
    if (target.className == 'modal') {
      dispatch(setIsEditModalOpen(false));
    }
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(updateNode(game.id, tempNode)); // TODO: async
    dispatch(setIsEditModalOpen(false));
  };

  const removeEditor = (editorToRemove: User): void => {
    tempNode.editors.filter((e) => e !== editorToRemove.id);
    const infoLevels = tempNode.informationLevels;
    const infoLevel = infoLevels.find((i) => i.userId === editorToRemove.id) as InfoLevel;
    infoLevel.infoLevel = 0;
    setTempNode({
      ...tempNode,
      // informationLevels: infoLevels,
      // editors: editors,
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
    tempNode.editors.push(playerToAdd.id);
    const infoLevels = tempNode.informationLevels;
    const infoLevel = infoLevels.find((i) => i.userId === playerToAdd.id) as InfoLevel;
    infoLevel.infoLevel = getMaxInfoLevel();
    setTempNode({
      ...tempNode,
      // informationLevels: infoLevels,
    });
  };

  const handleInformationLevelChange = (e: SyntheticEvent, player: User): void => {
    const target = e.target as HTMLInputElement;
    const infoLevel = tempNode.informationLevels.find((i) => i.userId == player.id) as InfoLevel;
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

  const getInfoLevelValue = (playerId: number): string => {
    const infoLevel = tempNode.informationLevels.find((i) => i.userId === playerId) as InfoLevel;
    if (infoLevel) {
      return infoLevel.toString();
    } else {
      return '0';
    }
  };

  const renderVisibleSubnodeNames = (playerId: number): JSX.Element => {
    const infoLevel = tempNode.informationLevels.find((i) => i.userId === playerId) as InfoLevel;
    const visibleSubnodes = tempNode.subnodes.filter((subnode) => subnode.informationLevel <= infoLevel.infoLevel);
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
              {tempNode.editors.map((editor) => {
                // TODO: Use user style from sidebar
                return (
                  <div className="users-box__user" key={uid(editor)}>
                    <p>{editor.username}</p>
                    <button
                      aria-label="Remove user as editor"
                      disabled={GETuserIsGMInGame(editor.id, this.state.game.id) /* TODO: Change this to Redux */}
                      onClick={() => {
                        removeEditor(editor);
                      }}
                    >
                      <Close />
                    </button>
                  </div>
                );
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
                {tempNode.players.map((player) => {
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
                {tempNode.players.map((player) => {
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
                          value={getInfoLevelValue(player)}
                          onChange={(event) => {
                            handleInformationLevelChange(event, player);
                          }}
                        ></input>
                      </TableCell>
                      {renderVisibleSubnodeNames(player)}
                    </TableRow>
                  );
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
