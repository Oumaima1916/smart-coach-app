import { createSlice } from '@reduxjs/toolkit';

const workoutSlice = createSlice({
  name: 'workout',
  initialState: {
    activeFilter: 'All',
  },
  reducers: {
    setFilter(state, action) {
      state.activeFilter = action.payload;
    },
  },
});

export const { setFilter } = workoutSlice.actions;
export default workoutSlice.reducer;
