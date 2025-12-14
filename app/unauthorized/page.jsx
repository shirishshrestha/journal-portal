"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ConfirmationPopup } from "@/features/shared/components";

const Unauthorized = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { mutate: logoutMutate, isPending: isLogoutPending } = useLogout();
  const role = useSelector((state) => state.auth?.userData?.roles);
  const userName = useSelector((state) => state.auth?.userData?.first_name);

  const handleLogoutConfirm = () => {
    logoutMutate();
  };

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Not Found Animation */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              resolvedTheme === "dark"
                ? "/not-found-dark.gif"
                : "/not-found-white.gif"
            }
            alt="Unauthorized Access"
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-5xl font-semibold text-foreground">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-md md:text-md text-muted-foreground max-w-md mx-auto">
          You don&apos;t have permission to access this page. Please contact
          your administrator if you believe this is an error.
        </p>

        {/* User Info */}
        {userName && (
          <div className=" rounded-lg max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground">
              Logged in as{" "}
              <span className="font-semibold text-foreground">{userName}</span>
            </p>

            {role && (
              <p className="text-sm text-muted-foreground mt-1">
                Role: {Array.isArray(role) ? role.join(", ") : role}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={handleGoHome}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Button>
          <Button
            onClick={handleLogoutClick}
            variant="destructive"
            size="lg"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        onConfirm={handleLogoutConfirm}
        confirmText="Logout"
        cancelText="Cancel"
        isPending={isLogoutPending}
        loadingText="Logging Out..."
      />
    </div>
  );
};

export default Unauthorized;
