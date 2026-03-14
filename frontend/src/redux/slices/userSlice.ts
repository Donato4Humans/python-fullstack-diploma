import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../models/IUser';

interface UserState {
  user: IUser | null;
  isAuthRestored: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthRestored: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isAuthRestored = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthRestored = true;
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    },
    setAuthRestored: (state) => {
      state.isAuthRestored = true;
    },
  },
});

export const { setUser, logout, setAuthRestored } = userSlice.actions;
export default userSlice.reducer;