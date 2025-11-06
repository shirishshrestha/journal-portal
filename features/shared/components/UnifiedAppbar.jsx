"use client";

import { useState } from "react";
import { ChevronDown, LogOut, Moon, Sun, Laptop, User } from "lucide-react";
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

// Role to route mapping
const roleRouteMap = {
  READER: "/reader/dashboard",
  AUTHOR: "/author/overview",
  REVIEWER: "/reviewer/overview",
  EDITOR: "/editor/overview",
  ADMIN: "/admin/overview",
};

export function UnifiedAppbar({
  userName,
  roles,
  userDetails,
  userRole,
  userAvatar,
}) {
  const [currentRole, setCurrentRole] = useState(
    userRole || roles?.[0] || "READER"
  );
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    const route = roleRouteMap[role] || "/reader/dashboard";
    router.push(route);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/login");
  };

  const handleProfileClick = () => {
    const role = currentRole.toLowerCase();
    router.push(`/${role}/profile`);
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
              <Button variant="outline" className="gap-2 bg-transparent">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : theme === "light" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Laptop className="h-4 w-4" />
                )}
                <span className="capitalize">{theme || "system"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="h-4 w-4 mr-2" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="h-4 w-4 mr-2" /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="h-4 w-4 mr-2" /> System
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
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
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
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
