import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqWith } from 'lodash';

interface NodeviewState {
  activeNode: number;
  canvasX: number;
  canvasY: number;
  canvasScale: number;
  isEditModalOpen: boolean;
  isUsersModalOpen: boolean;
  isImageModalOpen: boolean;
}

const initialState: NodeviewState = {
  activeNode: -1,
  canvasX: 0,
  canvasY: 0,
  canvasScale: 1,
  isEditModalOpen: false,
  isUsersModalOpen: false,
  isImageModalOpen: false,
};

const nodeviewSlice = createSlice({
  name: 'nodeview',
  initialState: initialState,
  reducers: {
    setIsEditModalOpen: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsUsersModalOpen: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isUsersModalOpen = action.payload;
    },
    setIsImageModalOpen: (state: NodeviewState, action: PayloadAction<boolean>) => {
      state.isImageModalOpen = action.payload;
    },
    setActiveNode: (state: NodeviewState, action: PayloadAction<number>) => {
      state.activeNode = action.payload;
    },
    setCanvasPos: (state: NodeviewState, action: PayloadAction<[number, number]>) => {
      const [x, y] = action.payload;
      state.canvasX = x;
      state.canvasY = y;
    },
    setCanvasScale: (state: NodeviewState, action: PayloadAction<number>) => {
      state.canvasScale = action.payload;
    },
  },
});

export default nodeviewSlice.reducer;
export const {
  setIsEditModalOpen,
  setIsImageModalOpen,
  setIsUsersModalOpen,
  setActiveNode,
  setCanvasPos,
  setCanvasScale,
} = nodeviewSlice.actions;
