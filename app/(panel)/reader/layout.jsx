// app/reader/layout.js
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ReaderAppbar, ReaderSidebar, RoleBasedRoute } from "@/features";
import { useSelector } from "react-redux";

export default function ReaderLayout({ children }) {
  const userData = useSelector((state) => state.auth?.userData);

  const userName = userData
    ? userData.first_name + " " + userData.last_name
    : "Reader";

  return (
    <RoleBasedRoute allowedRoles={["READER"]}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          <ReaderSidebar />
          <div className="flex-1 pt-3 flex flex-col overflow-auto px-2">
            <ReaderAppbar
              userDetails={userData}
              userName={userName}
              roles={userData.roles}
            />
            <main className="flex-1  p-5 px-0">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </RoleBasedRoute>
  );
}
