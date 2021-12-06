/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { GETuserIsGMInGame } from '../../mock-backend';

interface NodeviewState {
  activeNode: string;
  invisibleNodes: string[];
  canvasX: number;
  canvasY: number;
  canvasScale: number;
  isEditModalOpen: boolean;
  isEditPermissionsModalOpen: boolean;
  isUsersModalOpen: boolean;
  isImageModalOpen: boolean;
  isUserGameAdmin: boolean;
}

const initialState: NodeviewState = {
  activeNode: '',
  invisibleNodes: [],
  canvasX: 0,
  canvasY: 0,
  canvasScale: 1,
  isEditModalOpen: false,
  isEditPermissionsModalOpen: false,
  isUsersModalOpen: false,
  isImageModalOpen: false,
  isUserGameAdmin: false,
};

const nodeviewSlice = createSlice({
  name: 'nodeview',
  initialState: initialState,
  reducers: {
    setActiveNode: (state: NodeviewState, action: PayloadAction<string>) => {
      state.activeNode = action.payload;
    },
    addInvisibleNode: (state: NodeviewState, action: PayloadAction<string>) => {
      const index = state.invisibleNodes.indexOf(action.payload);
      if (index == -1) state.invisibleNodes.push(action.payload);
    },
    removeInvisibleNode: (state: NodeviewState, action: PayloadAction<string>) => {
      const index = state.invisibleNodes.indexOf(action.payload);
      if (index > -1) state.invisibleNodes.splice(index, 1);
    },
    setCanvasPos: (state: NodeviewState, action: PayloadAction<[number, number]>) => {
      const [x, y] = action.payload;
      state.canvasX = x;
      state.canvasY = y;
    },
    setCanvasScale: (state: NodeviewState, action: PayloadAction<number>) => {
      state.canvasScale = action.payload;
    },
    setIsEditModalOpen: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsEditPermissionsModalOpen: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isEditPermissionsModalOpen = action.payload;
    },
    setIsUsersModalOpen: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isUsersModalOpen = action.payload;
    },
    setIsImageModalOpen: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isImageModalOpen = action.payload;
    },
    setIsUserGameAdmin: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isUserGameAdmin = action.payload;
    },
  },
});

export default nodeviewSlice.reducer;
export const {
  setActiveNode,
  addInvisibleNode,
  removeInvisibleNode,
  setCanvasPos,
  setCanvasScale,
  setIsEditModalOpen,
  setIsEditPermissionsModalOpen,
  setIsImageModalOpen,
  setIsUsersModalOpen,
} = nodeviewSlice.actions;

export const processUserGameData = (userId: number, gameId: number): any => {
  const thunk = async (dispatch: Dispatch<any>): Promise<void> => {
    // TODO
    // dispatch(nodeviewSlice.actions.setIsUserGameAdmin(GETuserIsGMInGame(userId, gameId)));
  };

  return thunk;
};
