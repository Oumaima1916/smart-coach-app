import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import workoutReducer from './workoutSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
  },
});

export default store;
