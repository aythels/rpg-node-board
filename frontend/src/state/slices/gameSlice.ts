/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { GETgameById, GETnodeById, GETuserById, GETuserByUsername } from '../../mock-backend';
import { Game, Node, User } from '../../types';
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
  activeNode: Node;
}
const initialState: GameState = {
  gameInstance: {} as Game, // TODO: get rid of this hack by treating the "undefined" case, too
  status: AsyncStatus.Loading,
  showUserAlreadyAddedDialog: false,
  activeNode: {} as Node,
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
    setGameTitle: (state: GameState, action: PayloadAction<string>) => {
      state.gameInstance.title = action.payload;
    },
  },
});
export default gameSlice.reducer;
export const { gameLoaded, hideUserAlreadyAddedDialog } = gameSlice.actions;

// Thunks (async calls)
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
    return game.nodes.map(GETnodeById).filter((node) => {
      node.informationLevels.filter((i) => i.userId === user.id)[0].infoLevel > 0;
    });
  },
);
