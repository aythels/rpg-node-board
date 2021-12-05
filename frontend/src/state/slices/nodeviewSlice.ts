import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NodeviewState {
  activeNode: string;
  isEditModalOpen: boolean;
  isUsersModalOpen: boolean;
  isImageModalOpen: boolean;
}

const initialState: NodeviewState = {
  activeNode: '',
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
    setActiveNode: (state: NodeviewState, action: PayloadAction<string>) => {
      state.activeNode = action.payload;
    },
  },
});

export default nodeviewSlice.reducer;
export const { setIsEditModalOpen, setIsImageModalOpen, setIsUsersModalOpen, setActiveNode } = nodeviewSlice.actions;
