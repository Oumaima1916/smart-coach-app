import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    loginSuccess(state, { payload }) {
      state.user            = payload.user;
      state.token           = payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", payload.token);
    },
    logoutUser(state) {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logoutUser } = authSlice.actions;
export default authSlice.reducer;