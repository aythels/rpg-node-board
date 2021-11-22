/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDraftSafeSelector, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { GETuserByUsername } from '../../mock-backend';
import { User, UserPermission, UserPermissionRecord } from '../../types';
import { RootState } from '../rootReducer';

interface UserState {
  userInstance: User;
}

const initialState: UserState = {
  userInstance: {} as User, //TODO: fix hack
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    loginUser: (state: UserState, action: PayloadAction<User>) => {
      console.log('Logging in user');
      state.userInstance = action.payload;
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
    dispatch(userSlice.actions.loginUser(user));
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
