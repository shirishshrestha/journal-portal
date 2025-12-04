"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const router = useRouter();
  const authStatus = useSelector((state) => state.auth?.status);
  const userRoles = useSelector((state) => state.auth?.userData?.roles || []);
  const email_verified = useSelector(
    (state) => state.auth?.userData?.email_verified
  );

  useEffect(() => {
    if (!authStatus || userRoles.length === 0) {
      router.replace("/login");
      return;
    }

    if (
      userRoles.length === 1 &&
      userRoles[0] === "READER" &&
      !email_verified
    ) {
      router.replace("/pending-verification?email_verified=false");
      return;
    }

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      router.replace("/unauthorized");
    }
  }, [authStatus, userRoles, router, allowedRoles, email_verified]);

  // Show nothing while redirecting
  const hasRole = allowedRoles.some((role) => userRoles.includes(role));
  if (!authStatus || userRoles.length === 0 || !hasRole) {
    return null;
  }

  return children;
};

export default RoleBasedRoute;
