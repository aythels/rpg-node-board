/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDraftSafeSelector, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { Game, Node, User, UserPermission, UserPermissionRecord } from '../../types';
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
    addImage: (state: UserState, action: PayloadAction<NonNullable<Node['image']>>) => {
      state.userInstance.images.push(action.payload);
    },
    updateGameListImage: (state: UserState, action: PayloadAction<[Game['_id'], Game['image']]>) => {
      const [gameId, image] = action.payload;
      const game = state.games.find((game) => game._id === gameId);
      if (game) {
        game.image = image;
      }
    },
    updateUserData: (state: UserState, action: PayloadAction<UserDataUpdates>) => {
      // Note: We have to do it this way because interface and types are not actual JS objects;
      // Record<...> is a JS object, but it does not enforce attribute types as elegantly as types or interfaces
      const { email, username, password, profilePicture } = action.payload;
      if (email) {
        state.userInstance.email = email;
      }
      if (username) {
        state.userInstance.username = username;
      }
      if (password) {
        state.userInstance.password = password;
      }
      if (profilePicture) {
        state.userInstance.profilePicture = profilePicture;
      }
    },
    removeUserFromGame: (state: UserState, action: PayloadAction<Game['_id']>) => {
      const gameId = action.payload;
      state.games = state.games.filter((game) => game._id !== gameId);
    },
  },
});

export default userSlice.reducer;
export const { updateGameListImage } = userSlice.actions;

// Thunks
export const addImage = (image: NonNullable<Node['image']>): any => {
  const addImageThunk = async (dispatch: Dispatch<any>, getState: () => RootState): Promise<void> => {
    const userId = getState().user.userInstance._id;
    try {
      // TODO: define a new request for this
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/images`, {
        method: 'PATCH',
        body: JSON.stringify({ image }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      switch (response.status) {
        case 200:
          dispatch(userSlice.actions.addImage(image));
          break;
        default:
          console.error("Could not add image to the user's collection of images.");
          break;
      }
    } catch {
      console.error("Could not add image to the user's collection of images.");
    }
  };
  return addImageThunk;
};

export const loginUser = (username: string): any => {
  const loginUserThunk = async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/username/${username}`);
      const user: User = await response.json();
      const results: PromiseSettledResult<Game>[] = await Promise.allSettled(
        user.games.map(async (gameId) => {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}`);
          const game = await response.json();
          return game;
        }),
      );

      const games: Game[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          games.push(result.value);
        } else {
          console.error('Could not fetch game');
          console.error(result.reason);
        }
      }
      dispatch(userSlice.actions.loginUser([user, games]));
    } catch {
      console.error('Log in unsuccessful');
    }
  };
  return loginUserThunk;
};

export const removeUserFromGame = (gameId: Game['_id']) => {
  const removeUserFromGameThunk = async (dispatch: Dispatch<any>, getState: () => RootState): Promise<void> => {
    try {
      const userId = getState().user.userInstance._id;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/game/${gameId}/user/${userId}`, {
        method: 'DELETE',
      });
      switch (response.status) {
        case 200:
          dispatch(userSlice.actions.removeUserFromGame(gameId));
          break;
        default:
          console.error('Could not remove user from game.');
          break;
      }
    } catch {
      console.error('Could not remove user from game.');
    }
  };
  return removeUserFromGameThunk;
};

export type UserDataUpdates = {
  email?: User['email'];
  username?: User['username'];
  password?: User['password'];
  profilePicture?: User['profilePicture'];
};
export const updateUserData = (updates: UserDataUpdates): any => {
  const updateUserDataThunk = async (dispatch: Dispatch<any>, getState: () => RootState): Promise<void> => {
    const userId = getState().user.userInstance._id;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      switch (response.status) {
        case 200:
          dispatch(userSlice.actions.updateUserData(updates));
          break;
        default:
          console.error('Could not update profile picture.');
          break;
      }
    } catch {
      console.error('Could not update profile picture.');
    }
  };
  return updateUserDataThunk;
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
