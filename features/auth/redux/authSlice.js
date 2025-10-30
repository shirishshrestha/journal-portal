import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      document.cookie = `auth-token=${
        action.payload.userData.access
      }; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      document.cookie = "auth-token=; path=/; max-age=0";
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:auth");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
