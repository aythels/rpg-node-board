/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { GETgameById, GETuserById, GETuserByUsername, PUTnode } from '../../mock-backend';
import { Game, Node, User, UserPermission } from '../../types';
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

enum AsyncStatus {
  Loading,
  Idle,
}
interface GameState {
  gameInstance: Game;
  status: AsyncStatus;
  showUserAlreadyAddedDialog: boolean;
  activeNode: number; // Should be ID (normalized data)
}
const initialState: GameState = {
  gameInstance: {} as Game, // TODO: get rid of this hack by treating the "undefined" case, too
  status: AsyncStatus.Loading,
  showUserAlreadyAddedDialog: false,
  activeNode: -1,
};

// Reducer
const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    // Note: in-place edits of state are okay thanks to immer under the hood
    addPlayer: (state: GameState, action: PayloadAction<string>) => {
      const username = action.payload;
      // TODO: we cannot call the backend like this - fix this by storing users
      // directly in the game instance
      const user = GETuserByUsername(username);
      if (user) {
        if (state.gameInstance.users.includes(user.id)) {
          state.showUserAlreadyAddedDialog = true;
        } else {
          // TODO: add normalization
          state.gameInstance.players.push(user.id);
          state.gameInstance.users.push(user.id);
        }
      }
    },
    removePlayer: (state: GameState, action: PayloadAction<number>) => {
      const isNotThePlayer = (id: number) => id !== action.payload;
      state.gameInstance.players = state.gameInstance.players.filter(isNotThePlayer);
      state.gameInstance.users = state.gameInstance.users.filter(isNotThePlayer);
      state.gameInstance.gms = state.gameInstance.gms.filter(isNotThePlayer);
    },
    hideUserAlreadyAddedDialog: (state: GameState) => {
      state.showUserAlreadyAddedDialog = false;
    },
    gameLoaded: (state: GameState, action: PayloadAction<Game>) => {
      state.gameInstance = action.payload;
      state.status = AsyncStatus.Idle;
    },
    setActiveNode: (state: GameState, action: PayloadAction<number>) => {
      state.activeNode = action.payload;
    },
    updateNode: (state: GameState, action: PayloadAction<Node>) => {
      const index = state.gameInstance.nodes.findIndex((node) => node.id === action.payload.id);
      state.gameInstance.nodes[index] = action.payload;
    },
    setGameTitle: (state: GameState, action: PayloadAction<string>) => {
      state.gameInstance.title = action.payload;
    },
  },
});
export default gameSlice.reducer;
export const { gameLoaded, hideUserAlreadyAddedDialog, setActiveNode } = gameSlice.actions;

// Thunks (async calls)
// should we use createAsyncThunk() here?

export const fetchGame = (gameId: number): any => {
  const fetchGameThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    const game = GETgameById(gameId);
    dispatch(gameLoaded(game));
  };
  return fetchGameThunk;
};

export const addPlayer = (name: string): any => {
  const addPlayerThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.addPlayer(name));
    // TODO: make async call
    // POSTaddPlayerToGame();
  };
  return addPlayerThunk;
};

export const removePlayer = (id: number): any => {
  const removePlayerThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.removePlayer(id));
    // TODO: make async call
    // POSTremovePlayerFromGame(...);
  };
  return removePlayerThunk;
};

export const updateNode = (gameId: number, node: Node): any => {
  const updateNodeThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    // TODO: make async call
    PUTnode(gameId, node);
    dispatch(gameSlice.actions.updateNode(node));
  };
  return updateNodeThunk;
};

export const setGameTitle = (newTitle: string): any => {
  const setGameTitleThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(gameSlice.actions.setGameTitle(newTitle));
    // TODO: make async call
    // POSTupdateGameName(game id, title)
  };
  return setGameTitleThunk;
};

// Selectors
export const selectUsers: any = createSelector(
  (state: RootState): Game => state.game.gameInstance,
  (game: Game): User[] => {
    return Object.keys(game).length === 0 ? [] : game.users.map(GETuserById);
  },
);

export const selectVisibleNodes: any = createSelector(
  (state: RootState): Game => state.game.gameInstance,
  (state: RootState): User => state.user.userInstance,
  (game: Game, user: User): Node[] => {
    return game.nodes.filter((node) => {
      node.informationLevels.filter((i) => i.userId === user.id)[0].infoLevel > 0;
    });
  },
);

export const selectActiveNode: any = createSelector(
  (state: RootState): Node[] => state.game.gameInstance.nodes,
  (state: RootState): number => state.game.activeNode,
  (nodes: Node[], activeNodeId: number): Node => {
    return nodes.find((node) => node.id === activeNodeId) as Node;
  },
);

export const selectPlayers: any = createSelector(
  (state: RootState): Game => state.game.gameInstance,
  (game: Game): User[] => {
    // TODO: either async or store users in game state
    return game.users.filter((i) => i.permission === UserPermission.player).map((record) => GETuserById(record.userId));
  },
);

export const selectGameMasters: any = createSelector(
  (state: RootState): Game => state.game.gameInstance,
  (game: Game): User[] => {
    // TODO: either async or store users in game state
    return game.users
      .filter((i) => i.permission === UserPermission.gameMaster)
      .map((record) => GETuserById(record.userId));
  },
);
