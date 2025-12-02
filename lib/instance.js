import axios from "axios";
import { API_URL } from "./constants";
import { toast } from "sonner";

const PUBLIC_ENDPOINTS = ["/login/", "/register/"];

let router = null;
let storeRef = null;
let logoutAction = null;

// Set store and logout action dynamically to avoid circular dependency
export const setStoreReference = (store, logout) => {
  storeRef = store;
  logoutAction = logout;
};

export const setAxiosRouter = (routerInstance) => {
  router = routerInstance;
};

export const instance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

let authChannel = null;

// Initialize BroadcastChannel only in browser
if (typeof window !== "undefined") {
  authChannel = new BroadcastChannel("auth-channel");

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (authChannel) {
      authChannel.close();
      authChannel = null;
    }
  });
}

// Flag to prevent multiple refresh calls at the same time
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const isPublicEndpoint = (url) => {
  return PUBLIC_ENDPOINTS.some((endpoint) => url?.includes(endpoint));
};

// Attach access token
// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Skip auth for public endpoints
    if (isPublicEndpoint(config.url)) {
      return config;
    }

    if (storeRef) {
      const state = storeRef.getState();
      const access = state?.auth?.access;

      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Handle 401 + Refresh token logic
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    // Only handle 401 errors
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't retry public endpoints
    if (isPublicEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Queue requests while refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const currentAccess = storeRef?.getState()?.auth?.access;
      const isAuthenticated = storeRef?.getState()?.auth?.status;

      // If user is not authenticated, don't try to refresh
      if (!currentAccess || !isAuthenticated) {
        throw new Error("No valid session");
      }

      const response = await axios.post(
        `${API_URL}auth/refresh/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentAccess}`,
          },
          withCredentials: true,
        }
      );

      const newAccessToken = response.data.access;

      // Update store
      if (storeRef) {
        storeRef.dispatch({
          type: "auth/updateToken",
          payload: { access: newAccessToken },
        });
      }

      document.cookie = `auth-token=${newAccessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;

      // Process queued requests
      processQueue(null, newAccessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return instance(originalRequest);
    } catch (refreshError) {
      // Handle refresh failure
      processQueue(refreshError, null);

      // Clear auth state
      if (storeRef && logoutAction) {
        storeRef.dispatch(logoutAction());
      }

      // Notify user
      toast.error("Session expired. Please log in again.");

      // Broadcast to other tabs
      if (authChannel) {
        authChannel.postMessage("logout");
      }

      // Redirect to login with fallback
      const redirectToLogin = () => {
        if (router) {
          router.push("/login");
        } else if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      };

      // Small delay for toast visibility
      setTimeout(redirectToLogin, 1000);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
