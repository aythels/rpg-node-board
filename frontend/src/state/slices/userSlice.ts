/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDraftSafeSelector, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { GETgamesByUserID, GETuserByUsername } from '../../mock-backend';
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

// Thunks
export const loginUser = (username: string): any => {
  const loginUserThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    const user = GETuserByUsername(username);
    const games = GETgamesByUserID(user.id);
    dispatch(userSlice.actions.loginUser([user, games]));
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
