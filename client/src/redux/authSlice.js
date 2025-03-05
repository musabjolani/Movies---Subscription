import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  permissions: [] || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    removeToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

export const { setToken, removeToken, setPermissions } = authSlice.actions;
export default authSlice.reducer;
