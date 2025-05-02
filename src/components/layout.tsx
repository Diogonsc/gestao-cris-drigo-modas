
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <SidebarTrigger className="mb-4 lg:hidden">
              <span className="sr-only">Toggle Sidebar</span>
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// Import the Menu icon from lucide-react
import { Menu } from "lucide-react";
