"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const router = useRouter();
  const authStatus = useSelector((state) => state.auth?.status);
  const userRoles = useSelector((state) => state.auth?.userData?.roles || []);
  const isVerified = useSelector((state) => state.auth?.userData?.is_verified);

  useEffect(() => {
    if (!authStatus || userRoles.length === 0) {
      router.replace("/login");
      return;
    }

    if (isVerified === false && !userRoles.includes("ADMIN")) {
      router.replace("/pending-verification");
      return;
    }

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      router.replace("/unauthorized");
    }
  }, [authStatus, userRoles, isVerified, router, allowedRoles]);

  // Show nothing while redirecting
  const hasRole = allowedRoles.some((role) => userRoles.includes(role));
  if (
    !authStatus ||
    userRoles.length === 0 ||
    (isVerified === false && !userRoles.includes("ADMIN")) ||
    !hasRole
  ) {
    return null;
  }

  return children;
};

export default RoleBasedRoute;
