/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';

import { PUTnode } from '../../mock-backend';
import { Game, Node, Subnode, User, UserPermission, UserPermissionRecord } from '../../types';

import { createSlice, createDraftSafeSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import Delta from 'quill-delta';

export enum GameLoadingStatus {
  Loading,
  Idle,
}

export type GameDialog = 'userAlreadyAdded' | 'userNotFound';
interface GameState {
  gameInstance: Game;
  status: GameLoadingStatus;
  dialogStatus: { [key in GameDialog]: boolean };
}

const initialState: GameState = {
  gameInstance: {} as Game, // TODO: get rid of this hack by treating the "undefined" case, too
  status: GameLoadingStatus.Loading,
  dialogStatus: {
    userAlreadyAdded: false,
    userNotFound: false,
  },
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
    addPlayer: (state: GameState, action: PayloadAction<UserPermissionRecord>) => {
      state.gameInstance.users.push(action.payload);
    },
    removePlayer: (state: GameState, action: PayloadAction<User['_id']>) => {
      const idToRemove = action.payload;
      state.gameInstance.users = state.gameInstance.users.filter((user) => user.userId !== idToRemove);
    },
    updateDialogStatus: (state: GameState, action: PayloadAction<[GameDialog, boolean]>) => {
      const [dialog, status] = action.payload;
      state.dialogStatus[dialog] = status;
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
export const { gameLoaded, updateDialogStatus } = gameSlice.actions;

export const fetchGame = (gameId: Game['_id']): any => {
  const fetchGameThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    console.log('Fetching game');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`);
      const game: Game = await response.json();

      switch (response.status) {
        case 200:
          dispatch(gameLoaded(game));
          break;
        default:
          // TODO: handle in UI
          console.error(`Could not fetch game ${gameId}`);
      }
    } catch {
      console.error(`Could not fetch game ${gameId}`);
    }
  };
  return fetchGameThunk;
};

export const addPlayer = (username: User['username'], gameId: Game['_id']): any => {
  const addPlayerThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/game/user`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ gameId, username }),
      });
      switch (response.status) {
        case 200:
          const record: UserPermissionRecord = await response.json();
          dispatch(gameSlice.actions.addPlayer(record));
          break;
        case 404:
          dispatch(gameSlice.actions.updateDialogStatus(['userNotFound', true]));
          break;
        case 422:
          dispatch(gameSlice.actions.updateDialogStatus(['userAlreadyAdded', true]));
          break;
      }
    } catch {
      console.error(`Could not add user ${username} to game`);
    }
  };
  return addPlayerThunk;
};

// TODO: test
export const removePlayer = (playerId: User['_id'], gameId: Game['_id']): any => {
  const removePlayerThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}/user/${playerId}`, {
        method: 'DELETE',
      });
      switch (response.status) {
        case 200:
          dispatch(gameSlice.actions.removePlayer(playerId));
          break;
        default:
          console.error(`Could not remove player ${playerId} from the game.`);
      }
    } catch {
      console.error(`Could not remove player ${playerId} from the game.`);
    }
  };
  return removePlayerThunk;
};

// TODO: HELP Filip
export const updateNode = (gameId: Game['_id'], node: Node): any => {
  const updateNodeThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    // TODO: make async call
    PUTnode(gameId, node);
    dispatch(gameSlice.actions.updateNode(node));
  };
  return updateNodeThunk;
};

// TODO: HELP Filip
// all of these args make me think that this is NOT the way to do this
export const updateSubnode = (gameId: Game['_id'], nodeId: number, subnodeId: number, change: Delta): any => {
  const updateSubnodeThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.updateSubnode({ nodeId: nodeId, subnodeId: subnodeId, change: change }));
    // TODO: make async call
    // PUTsubnode(gameId, nodeId, ...)
  };
  return updateSubnodeThunk;
};

// TODO: HELP Filip
export const addSubnode = (gameId: Game['_id'], nodeId: number, subnode: Subnode): any => {
  const addSubnodeThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    // TODO: async call
    // POSTsubnode(gameId, nodeId, ...)
    dispatch(gameSlice.actions.addSubnode({ nodeId: nodeId, subnode: subnode }));
  };
  return addSubnodeThunk;
};

// TODO: HELP Filip
export const setGameTitle = (newTitle: string): any => {
  const setGameTitleThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.setGameTitle(newTitle));
    // TODO: make async call
    // POSTupdateGameName(game id, title)
  };
  return setGameTitleThunk;
};

// TODO: HELP Filip
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
