import React from "react";
import { AppSidebar } from "../app-sidebar";
import { SidebarInset } from "../ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </div>
  );
}
