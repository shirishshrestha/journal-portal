import { clearStoredRole } from '@/features/shared';
import { createSlice } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';

const initialState = {
  status: false,
  userData: null,
  access: null,
};

const authSlice = createSlice({
  name: 'auth',
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

    updateVerificationStatus: (state, action) => {
      if (state.userData) {
        state.userData.email_verified = action.payload.isVerified;
      }
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.access = null;
      document.cookie = 'auth-token=; path=/; max-age=0';
      clearStoredRole();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:auth');
      }
    },
  },
});

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  throttle: 1000, // Wait 1 second between persist operations
};

export const persistAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);

export const { login, logout, updateVerificationStatus } = authSlice.actions;
export default authSlice.reducer;
