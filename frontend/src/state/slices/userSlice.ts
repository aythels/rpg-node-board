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
    updateGameListImage: (state: UserState, action: PayloadAction<[Game['_id'], Game['image']]>) => {
      const [gameId, image] = action.payload;
      const game = state.games.find((game) => game._id === gameId);
      if (game) {
        game.image = image;
      }
    },
    updateProfilePicture: (state: UserState, action: PayloadAction<User['profilePicture']>) => {
      state.userInstance.profilePicture = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { addImage, updateGameListImage } = userSlice.actions;

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
      dispatch(userSlice.actions.loginUser([user, games]));
    } catch {
      console.error('Log in unsuccessful');
    }
  };
  return loginUserThunk;
};

export const updateProfilePicture = (image: string): any => {
  const updateProfilePictureThunk = async (dispatch: Dispatch<any>, getState: () => RootState): Promise<void> => {
    const userId = getState().user.userInstance._id;
    try {
      const update: Partial<User> = { profilePicture: image };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(update),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      switch (response.status) {
        case 200:
          dispatch(userSlice.actions.updateProfilePicture(image));
          break;
        default:
          console.error('Could not update game image.');
          break;
      }
    } catch {
      console.error('Could not update game image.');
    }
  };
  return updateProfilePictureThunk;
};

// Selectors
export const selectIsGameMaster: any = createDraftSafeSelector(
  (state: RootState): UserPermissionRecord[] => state.game.gameInstance.users,
  (state: RootState): User['_id'] => state.user.userInstance._id,
  (records: UserPermissionRecord[], userId: User['_id']): boolean => {
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
