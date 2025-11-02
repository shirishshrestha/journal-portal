import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  access: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData?.user;
      state.access = action.payload.userData?.access;
      document.cookie = `auth-token=${
        action?.payload?.userData?.access
      }; path=/; max-age=${60 * 60 * 24 * 7}`;
    },

    updateToken: (state, action) => {
      if (state) {
        state.access = action.payload.access;
        document.cookie = `auth-token=${
          action.payload.userData?.access
        }; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.access = null;
      document.cookie = "auth-token=; path=/; max-age=0";
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:auth");
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
