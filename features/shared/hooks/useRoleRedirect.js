"use client";

import { useRouter } from "next/navigation";

const useRoleRedirect = () => {
  const router = useRouter();

  const redirectUser = (roles = []) => {
    if (!roles || roles.length === 0) {
      router.push("/unauthorized");
      return;
    }

    // Reader only
    if (roles.length === 1 && roles.includes("READER")) {
      router.push("/reader/dashboard");
      return;
    }

    // Single role (AUTHOR / REVIEWER / EDITOR / ADMIN)
    const singleRoles = ["AUTHOR", "REVIEWER", "EDITOR", "ADMIN"];
    const matchedSingle = roles.find((r) => singleRoles.includes(r));
    if (roles.length === 2 && roles.includes("READER") && matchedSingle) {
      router.push(`/${matchedSingle.toLowerCase()}/dashboard`);
      return;
    }

    // Multiple roles
    if (roles.length > 2) {
      router.push("/choose-role");
      return;
    }

    // Default fallback
    router.push("/unauthorized");
  };

  return { redirectUser };
};

export default useRoleRedirect;
