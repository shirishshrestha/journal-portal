"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function UnifiedSidebar({ menuItems, userRole, userName, userAvatar }) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  return (
    <Sidebar className="p-3 shadow-new bg-background">
      <SidebarContent className="bg-card rounded-xl border py-6 pt-0 shadow-new">
        {/* Logo Section */}
        <div className="flex justify-between items-center p-3 pb-0">
          {resolvedTheme === "dark" ? (
            <Image
              width={200}
              height={100}
              src="/omway-white.png"
              alt="logo"
              className="w-[130px]"
            />
          ) : (
            <Image
              width={200}
              height={100}
              src="/omway-logo.png"
              alt="logo"
              className="w-[130px]"
            />
          )}
        </div>

        {/* Menu Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Active state: exact match or starts with item.path
              const isActive =
                pathname === item.path || pathname.startsWith(item.path + "/");

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link className="flex items-center gap-3" href={item.path}>
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
