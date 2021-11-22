/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import { GETgameById, GETuserById, GETuserByUsername } from '../../mock-backend';
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
    addPlayer: (state: GameState, action: PayloadAction<User>) => {
      // TODO: we cannot call the backend like this - fix this by storing users
      // directly in the game instance
      const user = action.payload;
      if (user) {
        if (state.gameInstance.users.find((u) => u.userId === user.id)) {
          state.showUserAlreadyAddedDialog = true;
        } else {
          // TODO: add normalization
          state.gameInstance.users.push({
            userId: user.id,
            permission: UserPermission.player,
          });
        }
      }
    },
    removePlayer: (state: GameState, action: PayloadAction<number>) => {
      const idToRemove = action.payload;
      state.gameInstance.users = state.gameInstance.users.filter((user) => user.userId !== idToRemove);
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
    const user = GETuserByUsername(name); // TODO: make async
    dispatch(gameSlice.actions.addPlayer(user));
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
    // TODO: fetching from backend here is not a good idea, we should have access to User from game
    return Object.keys(game).length === 0 ? [] : game.users.map((user) => GETuserById(user.userId));
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
