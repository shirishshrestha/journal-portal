"use client";

import { useState } from "react";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ChevronDown, LogOut, Moon, Sun, Laptop, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ConfirmationPopup } from ".";

// Role to route mapping
const roleRouteMap = {
  READER: "/reader/dashboard",
  AUTHOR: "/author/dashboard",
  REVIEWER: "/reviewer/dashboard",
  EDITOR: "/editor/dashboard",
  ADMIN: "/admin/dashboard",
};

export function UnifiedAppbar({ userName, roles, userRole, setNewRole }) {
  const [currentRole, setCurrentRole] = useState(
    userRole || roles?.[0] || "READER"
  );
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const {
    mutate: logoutMutate,
    isPending: isLogoutPending,
    isSuccess: isLogoutSuccess,
  } = useLogout();

  const handleRoleChange = (role) => {
    // Only clear cache if role is actually changing
    if (role !== currentRole) {
      // Clear all cached queries when switching roles to prevent data leakage
      queryClient.clear();
    }

    setNewRole(role);
    setCurrentRole(role);
    const route = roleRouteMap[role] || "/reader/dashboard";
    router.push(route);
  };

  const handleLogoutConfirm = () => {
    logoutMutate();
  };

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="border rounded-xl shadow-new bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Sidebar Trigger */}
        <div>
          <SidebarTrigger className="" />
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-transparent hover:bg-secondary!"
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Laptop className="h-4 w-4" />
                )}
                <span className="capitalize hidden sm:inline">
                  {theme || "system"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="sm:w-40">
              <DropdownMenuItem
                className={"group"}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4 mr-2 group-hover:text-primary-foreground" />{" "}
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"group"}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-2 group-hover:text-primary-foreground" />{" "}
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                className={"group"}
                onClick={() => setTheme("system")}
              >
                <Laptop className="h-4 w-4 mr-2 group-hover:text-primary-foreground" />{" "}
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Switcher - only show if multiple roles */}
          {roles && roles.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="capitalize">
                    {currentRole.toLowerCase()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  Switch Role
                </div>
                {roles.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className="capitalize"
                  >
                    {role.toLowerCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-transparent!"
              >
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center ">
                  <span className="text-primary-foreground text-sm font-semibold">
                    {getUserInitials()}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-sm font-semibold">
                {userName}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className=" hover:text-primary-foreground group"
                onClick={handleProfileClick}
              >
                <User className="h-4 w-4 mr-2 group-hover:text-primary-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive hover:text-primary-foreground group"
                onClick={handleLogoutClick}
              >
                <LogOut className="h-4 w-4 mr-2 group-hover:text-primary-foreground " />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Logout Confirmation Popup */}
      <ConfirmationPopup
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        title="Logout"
        description="Are you sure you want to logout from your account?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        isPending={isLogoutPending}
        isSuccess={isLogoutSuccess}
        autoClose={true}
        loadingText="Logging out..."
        icon={<LogOut className="h-6 w-6 text-red-500" />}
      />
    </nav>
  );
}
