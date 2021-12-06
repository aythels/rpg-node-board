import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { InfoLevel, Node, User, UserPermission } from '../../types';
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
import { selectActiveNode, selectUserIds, updateNode } from '../../state/slices/gameSlice';
import cloneDeep from 'lodash.clonedeep';
import { setIsUsersModalOpen } from '../../state/slices/nodeviewSlice';

const NodeUserForm = (): JSX.Element => {
  const game = useSelector((state: RootState) => state.game.gameInstance);
  const node: Node = useSelector((state: RootState) => selectActiveNode(state));
  const dispatch = useDispatch();

  const [addEditorAnchorEl, setAddEditorAnchorEl] = useState(null as EventTarget | null);
  const [tempNode, setTempNode] = useState(cloneDeep(node) as Node);
  const [users, setUsers] = useState<User[]>([]);
  const userIds: User['_id'][] = useSelector((state: RootState) => selectUserIds(state));

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

  const removeEditor = (editorToRemove: User['_id']): void => {
    tempNode.editors = tempNode.editors.filter((e) => e !== editorToRemove);
    const infoLevels = tempNode.informationLevels;
    const infoLevel = infoLevels.find((i) => i.user === editorToRemove) as InfoLevel;
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

  const addEditor = (playerToAdd: User['_id']): void => {
    tempNode.editors.push(playerToAdd);
    const infoLevels = tempNode.informationLevels;
    const infoLevel = infoLevels.find((i) => i.user === playerToAdd) as InfoLevel;
    infoLevel.infoLevel = getMaxInfoLevel();
    setTempNode({
      ...tempNode,
      // informationLevels: infoLevels,
    });
  };

  const handleInformationLevelChange = (e: SyntheticEvent, player: User['_id']): void => {
    const target = e.target as HTMLInputElement;
    const infoLevel = tempNode.informationLevels.find((i) => i.user == player) as InfoLevel;
    infoLevel.infoLevel = parseInt(target.value);
    setTempNode({ ...tempNode });
  };

  const informationLevelHideAll = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.user)) {
        infoLevel.infoLevel = 0;
      }
    }
    setTempNode({ ...tempNode });
  };

  const informationLevelAllPlusOne = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.user)) {
        infoLevel.infoLevel++;
      }
    }
    setTempNode({ ...tempNode });
  };

  const informationLevelAllMinusOne = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.user)) {
        infoLevel.infoLevel--;
      }
    }
    setTempNode({ ...tempNode });
  };

  const informationLevelRevealAll = (): void => {
    for (const infoLevel of tempNode.informationLevels) {
      if (!tempNode.editors.includes(infoLevel.user)) {
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
    const infoLevel = tempNode.informationLevels.find((i) => i.user === playerId) as InfoLevel;
    if (infoLevel) {
      return infoLevel.infoLevel.toString();
    } else {
      return '0';
    }
  };

  const renderVisibleSubnodeNames = (playerId: User['_id']): JSX.Element => {
    const infoLevel = tempNode.informationLevels.find((i) => i.user === playerId) as InfoLevel;
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

  const fetchUsers = useCallback(async (userIds: User['_id'][]) => {
    const results: PromiseSettledResult<User>[] = await Promise.allSettled(
      userIds.map(async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`);
        const user = await response.json();
        return user;
      }),
    );

    const newUsers = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        newUsers.push(result.value);
      } else {
        console.error('Could not fetch user');
        console.error(result.reason);
      }
    }

    setUsers(newUsers);
  }, []);

  useEffect(() => {
    fetchUsers(userIds);
  }, []);

  // TODO: Make table responsive for mobile

  return (
    <div className="modal custom-modal nodeuserform" onClick={handleModalClick}>
      <form onSubmit={handleSubmit} className="modal-content-wrapper">
        <div className="modal__body">
          <div className="modal__body__section">
            <h4>Editors</h4>
            <div className="users-box">
              {users.map((user) => {
                if (tempNode.editors.includes(user._id)) {
                  return (
                    <div className="users-box__user" key={uid(user._id)}>
                      <p>{user.username}</p>
                      <button
                        aria-label="Remove user as editor"
                        disabled={
                          game.users.find((u) => u.userId === user._id)?.permission === UserPermission.gameMaster
                        }
                        onClick={() => {
                          removeEditor(user._id);
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
                {users.map((user) => {
                  if (!tempNode.editors.includes(user._id)) {
                    return (
                      <MenuItem key={uid(user)}>
                        <div className="users-box__user">
                          <button
                            onClick={() => {
                              addEditor(user._id);
                            }}
                          >
                            <p>{user.username}</p>
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
                {users.map((user) => {
                  if (!tempNode.editors.includes(user._id)) {
                    return (
                      <TableRow key={uid(user)}>
                        <TableCell align="left" component="th" scope="row">
                          {user.username}
                        </TableCell>
                        <TableCell align="right">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={getInfoLevelValue(user._id)}
                            onChange={(event) => {
                              handleInformationLevelChange(event, user._id);
                            }}
                          ></input>
                        </TableCell>
                        {renderVisibleSubnodeNames(user._id)}
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
