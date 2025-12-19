import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../models/IUser';

interface UserState {
  user: IUser | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;