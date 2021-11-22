/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { GETuserById } from '../../mock-backend';
import { User } from '../../types';

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
// TODO: actual log-in
export const loginUser = (userId: number): any => {
  const loginUserThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    const user = GETuserById(userId);
    dispatch(userSlice.actions.loginUser(user));
  };
  return loginUserThunk;
};

// Selectors
