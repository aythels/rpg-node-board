/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';

import { GETuserByUsername, PUTnode } from '../../mock-backend';
import { Game, Node, Subnode, User, UserPermission } from '../../types';

import { createSlice, createDraftSafeSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import Delta from 'quill-delta';

export enum GameLoadingStatus {
  Loading,
  Idle,
}
interface GameState {
  gameInstance: Game;
  status: GameLoadingStatus;
  showUserAlreadyAddedDialog: boolean;
}
const initialState: GameState = {
  gameInstance: {} as Game, // TODO: get rid of this hack by treating the "undefined" case, too
  status: GameLoadingStatus.Loading,
  showUserAlreadyAddedDialog: false,
};

interface SubnodeUpdate {
  nodeId: number;
  subnodeId: number;
  change: Delta;
}

interface SubnodeCreation {
  nodeId: number;
  subnode: Subnode;
}

// Reducer
const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    addPlayer: (state: GameState, action: PayloadAction<User>) => {
      const user = action.payload;
      if (user) {
        if (state.gameInstance.users.find((u) => u.userId === user._id)) {
          state.showUserAlreadyAddedDialog = true;
        } else {
          // TODO: add normalization
          state.gameInstance.users.push({
            userId: user._id,
            permission: UserPermission.player,
          });
        }
      }
    },
    removePlayer: (state: GameState, action: PayloadAction<User['_id']>) => {
      const idToRemove = action.payload;
      state.gameInstance.users = state.gameInstance.users.filter((user) => user.userId !== idToRemove);
    },
    hideUserAlreadyAddedDialog: (state: GameState) => {
      state.showUserAlreadyAddedDialog = false;
    },
    gameLoaded: (state: GameState, action: PayloadAction<Game>) => {
      state.gameInstance = action.payload;
      state.status = GameLoadingStatus.Idle;
    },
    updateNode: (state: GameState, action: PayloadAction<Node>) => {
      const index = state.gameInstance.nodes.findIndex((node) => node.id === action.payload.id);
      state.gameInstance.nodes[index] = action.payload;
    },
    updateSubnode: (state: GameState, action: PayloadAction<SubnodeUpdate>) => {
      const nodeToUpdate = state.gameInstance.nodes.find((node) => node.id === action.payload.nodeId) as Node;
      const subnodeToUpdate = nodeToUpdate.subnodes.find(
        (subnode) => subnode.id === action.payload.subnodeId,
      ) as Subnode;
      subnodeToUpdate.content.compose(action.payload.change);
      // Does doing this update state? ^
    },
    addSubnode: (state: GameState, action: PayloadAction<SubnodeCreation>) => {
      const nodeToUpdate = state.gameInstance.nodes.find((node) => node.id === action.payload.nodeId) as Node;
      nodeToUpdate.subnodes.push(action.payload.subnode);
    },
    setGameTitle: (state: GameState, action: PayloadAction<string>) => {
      state.gameInstance.title = action.payload;
    },
    updatePlayerPermission: (state: GameState, action: PayloadAction<[User['_id'], UserPermission]>) => {
      const [userId, newPermission] = action.payload;
      const user = state.gameInstance.users.find((user) => user.userId === userId);
      if (user) {
        user.permission = newPermission;
      }
    },
  },
});
export default gameSlice.reducer;
export const { gameLoaded, hideUserAlreadyAddedDialog } = gameSlice.actions;

// Thunks (async calls)
// should we use createAsyncThunk() here?

export const fetchGame = (gameId: Game['_id']): any => {
  const fetchGameThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    console.log('Fetching game');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`);
    const game: Game = await response.json();

    dispatch(gameLoaded(game));
  };
  return fetchGameThunk;
};

export const addPlayer = (name: string): any => {
  const addPlayerThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    const user = GETuserByUsername(name); // TODO: make async
    dispatch(gameSlice.actions.addPlayer(user));
    // TODO: make async call
    // POSTaddPlayerToGame();
  };
  return addPlayerThunk;
};

export const removePlayer = (id: User['_id']): any => {
  const removePlayerThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.removePlayer(id));
    // TODO: make async call
    // POSTremovePlayerFromGame(...);
  };
  return removePlayerThunk;
};

export const updateNode = (gameId: Game['_id'], node: Node): any => {
  const updateNodeThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    // TODO: make async call
    PUTnode(gameId, node);
    dispatch(gameSlice.actions.updateNode(node));
  };
  return updateNodeThunk;
};

// all of these args make me think that this is NOT the way to do this
export const updateSubnode = (gameId: Game['_id'], nodeId: number, subnodeId: number, change: Delta): any => {
  const updateSubnodeThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.updateSubnode({ nodeId: nodeId, subnodeId: subnodeId, change: change }));
    // TODO: make async call
    // PUTsubnode(gameId, nodeId, ...)
  };
  return updateSubnodeThunk;
};

export const addSubnode = (gameId: Game['_id'], nodeId: number, subnode: Subnode): any => {
  const addSubnodeThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    // TODO: async call
    // POSTsubnode(gameId, nodeId, ...)
    dispatch(gameSlice.actions.addSubnode({ nodeId: nodeId, subnode: subnode }));
  };
  return addSubnodeThunk;
};

export const setGameTitle = (newTitle: string): any => {
  const setGameTitleThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.setGameTitle(newTitle));
    // TODO: make async call
    // POSTupdateGameName(game id, title)
  };
  return setGameTitleThunk;
};

export const updatePlayerPermission = (payload: [User['_id'], UserPermission]): any => {
  const updatePlayerPermissionThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.updatePlayerPermission(payload));
    // TODO: make async call to:
    // PATCHpromoteUserToGameMaster
    // PATCHdemoteGameMasterToPlayer
  };
  return updatePlayerPermissionThunk;
};

export const selectVisibleNodes: any = createDraftSafeSelector(
  (state: RootState): Game => state.game.gameInstance,
  (state: RootState): User => state.user.userInstance,
  (game: Game, user: User): Node[] => {
    return game.nodes.filter((node) => {
      const match = node.informationLevels.find((i) => i.userId === user._id);
      return match && match.infoLevel > 0;
    });
  },
);

export const selectActiveNode: any = createDraftSafeSelector(
  (state: RootState): Node[] => state.game.gameInstance.nodes,
  (state: RootState): number => state.nodeview.activeNode, // this seems bad to do
  (nodes: Node[], activeNodeId: number): Node => {
    console.log(nodes);
    return nodes.find((node) => node.id === activeNodeId) as Node;
  },
);

export const selectUserIds: any = createDraftSafeSelector(
  (state: RootState): Game => state.game.gameInstance,
  (game: Game) => game.users.map((record) => record.userId),
);

export const selectGameMasterIds: any = createDraftSafeSelector(
  (state: RootState): Game => state.game.gameInstance,
  (game: Game): User['_id'][] => {
    // TODO: either async or store users in game state
    const gameMasterIds = game.users
      .filter((i) => i.permission === UserPermission.gameMaster)
      .map((record) => record.userId);
    return gameMasterIds;
  },
);
