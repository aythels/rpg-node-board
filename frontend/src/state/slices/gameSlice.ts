import { Dispatch } from 'redux';
import { GETgameById, GETuserById } from '../../mock-backend';
import { Game, User } from '../../types';
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';

enum AsyncStatus {
  Loading,
  Idle,
}
interface State {
  game: Game;
  status: AsyncStatus;
}
const initialState: State = {
  game: {} as Game, // TODO: get rid of this hack by treating the "undefined" case, too
  status: AsyncStatus.Loading,
};

// Reducer
const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    // Note: in-place edits of state are okay thanks to immer under the hood
    addPlayer: (state: State, action: PayloadAction<number>) => {
      state.game.players.push(action.payload);
      state.game.users.push(action.payload);
    },
    gameLoaded: (state: State, action: PayloadAction<Game>) => {
      state.game = action.payload;
      state.status = AsyncStatus.Idle;
    },
  },
});
export default gameSlice.reducer;
export const { addPlayer, gameLoaded } = gameSlice.actions;

// Selectors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectUsers: any = createSelector(
  (state: RootState): Game => state.game.game,
  (game: Game): User[] => {
    return Object.keys(game).length === 0 ? [] : game.users.map(GETuserById);
  },
);

// Async calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchGame = (gameId: number): any => {
  const fetchGameThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    const game = GETgameById(gameId);
    dispatch(gameLoaded(game));
  };
  return fetchGameThunk;
};
