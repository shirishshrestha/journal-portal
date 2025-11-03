"use client";

import { BarChart3, CheckCircle2, Settings, User } from "lucide-react";
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

// Add the actual routes for each item
const sidebarItems = [
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    href: "/reader/dashboard",
  },
  { id: "profile", label: "Profile", icon: User, href: "/reader/profile" },
  {
    id: "verification",
    label: "Verification",
    icon: CheckCircle2,
    href: "/reader/verification",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/reader/settings",
  },
];

export function ReaderSidebar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  return (
    <Sidebar className="p-3 shadow-new bg-background">
      <SidebarContent className="bg-card rounded-xl border py-6 pt-0 shadow-new">
        <div className="flex justify-between items-center p-3 pb-0 ">
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
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              // Mark active if current pathname matches the item's href
              const isActive = pathname === item.href;
              console.log(pathname);

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <a className="flex items-center gap-3" href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
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
