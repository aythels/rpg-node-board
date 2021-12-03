/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDraftSafeSelector, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Game, User, UserPermission, UserPermissionRecord } from '../../types';
import { RootState } from '../rootReducer';

interface UserState {
  userInstance: User;
  games: Game[];
}

const initialState: UserState = {
  userInstance: {} as User, //TODO: fix hack
  games: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginUser: (state: UserState, action: PayloadAction<[User, Game[]]>) => {
      const [user, games] = action.payload;
      state.userInstance = user;
      state.games = games;
    },
    addImage: (state: UserState, action: PayloadAction<string>) => {
      state.userInstance.images.push(action.payload);
    },
  },
});

export default userSlice.reducer;
export const { addImage } = userSlice.actions;

// TODO: temp
// {
//   method: 'GET',
//   headers: { 'Content-type': 'application/json' },
//   body: JSON.stringify({  }),
// }

// Thunks
export const loginUser = (username: string): any => {
  const loginUserThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/username/${username}`);
      const user: User = await response.json();
      const games: Game[] = await Promise.all(
        user.games.map(async (gameId) => {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`);
          const game = await response.json();
          return game;
        }),
      );
      console.log(games);
      dispatch(userSlice.actions.loginUser([user, games]));
    } catch {
      // TODO: update UI
      console.log('Log in unsuccessful');
    }
  };
  return loginUserThunk;
};

// Selectors
export const selectIsGameMaster: any = createDraftSafeSelector(
  (state: RootState): UserPermissionRecord[] => state.game.gameInstance.users,
  (state: RootState): number => state.user.userInstance.id,
  (records: UserPermissionRecord[], userId: number): boolean => {
    const userRecord = records.find((record) => record.userId === userId);
    if (userRecord) {
      return userRecord.permission === UserPermission.gameMaster;
    } else {
      return false;
    }
  },
);

export const selectIsLoggedIn: any = createDraftSafeSelector(
  (state: RootState): User => state.user.userInstance,
  (user: User): boolean => Object.keys(user).length > 0,
);
