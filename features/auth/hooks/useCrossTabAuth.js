import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout as authLogout, login as authLogin } from "../redux/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useRoleRedirect } from "@/features/shared";

const useCrossTabAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const channelRef = useRef(null);
  const currentAuth = useSelector((state) => state.auth?.access);
  const { redirectUser } = useRoleRedirect();
  const roles = useSelector((state) => state.auth?.userData?.roles || []);

  useEffect(() => {
    const channel = new BroadcastChannel("auth-channel");
    channelRef.current = channel;

    const handleMessage = (event) => {
      if (event.data === "logout") {
        dispatch(authLogout());
        router.push("/login");
      }
      if (event.data === "login") {
        // Sync auth from localStorage
        try {
          const persistedState = localStorage.getItem("persist:auth");
          if (persistedState) {
            const authData = JSON.parse(persistedState);
            // Parse the double-stringified tokens
            const access = authData.access ? JSON.parse(authData.access) : null;

            const userData =
              authData.userData !== "null"
                ? JSON.parse(authData.userData)
                : null;

            if (access) {
              console.log("Syncing login from another tab");

              // Update Redux state
              dispatch(
                authLogin({
                  userData: {
                    access,
                    user: userData,
                  },
                })
              );

              if (pathname === "/login") {
                redirectUser(roles);
              }
            }
          }
        } catch (error) {
          console.error("Failed to sync auth state:", error);

          if (pathname === "/login") {
            redirectUser(roles);
          }
        }
      }
    };

    // Also listen to storage changes (more reliable)
    const handleStorageChange = (e) => {
      if (e.key === "persist:auth" && e.newValue) {
        try {
          const authData = JSON.parse(e.newValue);

          // Parse the double-stringified tokens
          const access = authData.access ? JSON.parse(authData.access) : null;

          const userData =
            authData.userData !== "null" ? JSON.parse(authData.userData) : null;

          // Login detected
          if (access && !currentAuth) {
            console.log("Login detected via storage event");
            dispatch(
              authLogin({
                userData: {
                  access,
                  user: userData,
                },
              })
            );

            if (pathname === "/login") {
              redirectUser(roles);
            }
          }

          // Logout detected
          if (!access && currentAuth) {
            console.log("Logout detected via storage event");
            dispatch(authLogout());
            router.push("/login");
          }
        } catch (error) {
          console.error("Storage sync error:", error);
        }
      }
    };

    channel.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      channel.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorageChange);
      channel.close();
    };
  }, [dispatch, router, pathname, currentAuth, redirectUser, roles]);

  const broadcast = (messageType) => {
    channelRef.current?.postMessage(messageType);
  };

  return broadcast;
};

export default useCrossTabAuth;
