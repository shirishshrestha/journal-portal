import axios from "axios";
import { API_URL } from "./constants";
import store from "@/store/store";
import { toast } from "sonner";
import { logout as authLogout } from "@/features/auth/redux/authSlice";

const PUBLIC_ENDPOINTS = ["/login/", "/register/"];

let router = null;

export const setAxiosRouter = (routerInstance) => {
  router = routerInstance;
};

export const instance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

const authChannel = new BroadcastChannel("auth-channel");

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    authChannel.close();
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

    const state = store.getState();
    const access = state?.auth?.access;

    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
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
      const response = await axios.post(
        `${API_URL}auth/refresh/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${store.getState().auth?.access}`,
          },
          withCredentials: true,
        }
      );

      const newAccessToken = response.data.access;

      // Update store
      store.dispatch({
        type: "auth/updateToken",
        payload: { access: newAccessToken },
      });

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
      store.dispatch(authLogout());

      // Notify user
      toast.error("Session expired. Please log in again.");

      // Broadcast to other tabs
      authChannel.postMessage("logout");

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
