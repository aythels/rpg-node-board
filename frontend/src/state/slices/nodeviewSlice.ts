import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NodeviewState {
  activeNode: number;
  isEditModalOpen: boolean;
  isUsersModalOpen: boolean;
  isImageModalOpen: boolean;
}

const initialState: NodeviewState = {
  activeNode: -1,
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
  },
});

export default nodeviewSlice.reducer;
export const { setIsEditModalOpen, setIsImageModalOpen, setIsUsersModalOpen } = nodeviewSlice.actions;
