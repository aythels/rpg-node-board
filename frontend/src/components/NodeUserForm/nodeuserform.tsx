import { Component, SyntheticEvent } from 'react';
import { Game, Node, Subnode, User } from '../../types';
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
import {
  GETeditorsForNode,
  GETgameById,
  GETnodeById,
  GETplayersInGame,
  GETsubnodesByNodeId,
  GETuserById,
  GETuserIsGMInGame,
} from '../../mock-backend';
import { uid } from 'react-uid';

interface Props {
  gameId: number;
  nodeId: number;
  userId: number;
  closeCallback: () => void;
  // eslint-disable-next-line no-unused-vars
  submitCallback: (arg0: SyntheticEvent, arg1: Node) => void;
}

interface State {
  game: Game;
  node: Node;
  user: User;
  subnodes: Subnode[];
  closeCallback: () => void;
  // eslint-disable-next-line no-unused-vars
  submitCallback: (arg0: SyntheticEvent, arg1: Node) => void;
  editors: User[];
  players: User[];
  addEditorAnchorEl: EventTarget | null;
}

export default class NodeUserForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const game = GETgameById(props.gameId);
    const node = GETnodeById(props.nodeId);
    const user = GETuserById(props.userId);
    const subnodes = GETsubnodesByNodeId(node.id);
    const editors = GETeditorsForNode(node.id);
    const players = GETplayersInGame(game.id);
    const editorIds = editors.map((editor) => editor.id);
    this.state = {
      game: game,
      node: node,
      user: user,
      subnodes: subnodes,
      closeCallback: props.closeCallback,
      submitCallback: props.submitCallback,
      editors: editors,
      players: players.filter((player) => !editorIds.includes(player.id)),
      addEditorAnchorEl: null,
    };
  }

  handleModalClick = (e: SyntheticEvent): void => {
    const target = e.target as HTMLElement;
    if (target.className == 'modal') {
      this.handleClose();
    }
  };

  handleClose = (): void => {
    this.state.closeCallback();
  };

  handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const node = this.state.node;
    this.state.submitCallback(e, node);
  };

  removeEditor = (editorToRemove: User): void => {
    const players = this.state.players;
    players.push(editorToRemove);
    const node = this.state.node;
    node.informationLevels[editorToRemove.id] = 0;
    node.editors = node.editors.filter((editor) => editor != editorToRemove.id);
    this.setState({
      editors: this.state.editors.filter((editor) => editor != editorToRemove),
    });
    this.setState({
      players: players,
      node: node,
    });
  };

  addEditor = (playerToAdd: User): void => {
    const editors = this.state.editors;
    editors.push(playerToAdd);
    const players = this.state.players.filter((player) => player !== playerToAdd);
    const node = this.state.node;
    node.editors.push(playerToAdd.id);
    this.setState({
      editors: editors,
      players: players,
    });
  };

  handleInformationLevelChange = (e: SyntheticEvent, player: User): void => {
    const target = e.target as HTMLInputElement;
    const node = this.state.node;
    node.informationLevels[player.id] = parseInt(target.value);
    this.setState({
      node: node,
    });
  };

  informationLevelHideAll = (): void => {
    const node = this.state.node;
    const players = this.state.players;
    for (const player of players) {
      node.informationLevels[player.id] = 0;
    }
    this.setState({
      node: node,
    });
  };

  informationLevelAllPlusOne = (): void => {
    const node = this.state.node;
    const players = this.state.players;
    for (const player of players) {
      node.informationLevels[player.id] ? node.informationLevels[player.id]++ : (node.informationLevels[player.id] = 1);
    }
    this.setState({
      node: node,
    });
  };

  informationLevelAllMinusOne = (): void => {
    const node = this.state.node;
    const players = this.state.players;
    for (const player of players) {
      if (node.informationLevels[player.id] > 0) {
        node.informationLevels[player.id]--;
      }
    }
    this.setState({
      node: node,
    });
  };

  informationLevelRevealAll = (): void => {
    let max = 0;
    for (const subnode of this.state.subnodes) {
      max = subnode.informationLevel > max ? subnode.informationLevel : max;
    }
    const node = this.state.node;
    const players = this.state.players;
    for (const player of players) {
      node.informationLevels[player.id] = max;
    }
    this.setState({
      node: node,
    });
  };

  openNewEditorMenu = (e: SyntheticEvent): void => {
    const target = e.currentTarget;
    this.setState({
      addEditorAnchorEl: target,
    });
  };

  closeNewEditorMenu = (): void => {
    this.setState({
      addEditorAnchorEl: null,
    });
  };

  // TODO: Make table responsive for mobile

  render(): JSX.Element {
    return (
      <div className="modal" onClick={this.handleModalClick}>
        <form onSubmit={this.handleSubmit} className="modal-content-wrapper">
          <div className="modal__header">
            <p>Node Permissions</p>
          </div>
          <div className="modal__body">
            <div className="modal__body__section">
              <h4>Editors</h4>
              <div className="users-box">
                {this.state.editors.map((editor) => {
                  // TODO: Use user style from sidebar
                  return (
                    <div className="users-box__user" key={uid(editor)}>
                      <p>{editor.username}</p>
                      <button
                        aria-label="Remove user as editor"
                        disabled={GETuserIsGMInGame(editor.id, this.state.game.id) /* TODO: Change this to Redux */}
                        onClick={() => {
                          this.removeEditor(editor);
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
                    this.openNewEditorMenu(e);
                  }}
                >
                  <Add />
                </IconButton>
                <Menu
                  className="nodeview-menu-popup"
                  anchorEl={this.state.addEditorAnchorEl as Element}
                  open={Boolean(this.state.addEditorAnchorEl)}
                  onClose={this.closeNewEditorMenu}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {this.state.players.map((player) => {
                    return (
                      <MenuItem key={uid(player)}>
                        <div className="users-box__user">
                          <button
                            onClick={() => {
                              this.addEditor(player);
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
                    <TableCell align="right">Level</TableCell>
                    <TableCell align="right">Visible Subnodes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.players.map((player) => {
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
                            value={
                              this.state.node.informationLevels[player.id]
                                ? this.state.node.informationLevels[player.id].toString()
                                : 0
                            }
                            onChange={(event) => {
                              this.handleInformationLevelChange(event, player);
                            }}
                          ></input>
                        </TableCell>
                        <TableCell align="right">
                          {this.state.subnodes
                            .filter(
                              (subnode) => subnode.informationLevel <= this.state.node.informationLevels[player.id],
                            )
                            .map((subnode) => {
                              return <span key={uid(subnode)}>{subnode.name}, </span>;
                            })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="button-group">
                <Button onClick={this.informationLevelHideAll}>Hide All</Button>
                <Button onClick={this.informationLevelAllMinusOne}>All -1</Button>
                <Button onClick={this.informationLevelAllPlusOne}>All +1</Button>
                <Button onClick={this.informationLevelRevealAll}>Reveal All</Button>
              </div>
            </div>
          </div>
          <div className="modal__footer">
            <div>
              <Tooltip title="Discard Changes">
                <Button color="error" variant="contained" onClick={this.handleClose}>
                  <DeleteForever />
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title="Save Changes">
                <Button type="submit" variant="contained">
                  <SaveRounded />
                </Button>
              </Tooltip>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
