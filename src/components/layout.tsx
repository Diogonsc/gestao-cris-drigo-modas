import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Breadcrumbs } from "./ui/breadcrumbs";
import type { RouteConfig } from "@/routes";
import { routes } from "@/routes";
import { ReactNode } from "react";

function RouteBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbs = pathnames.map((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join("/")}`;
    const route = routes.find((r: RouteConfig) => r.path === path);
    return {
      path,
      title: route?.title || value,
    };
  });

  return <Breadcrumbs items={breadcrumbs} />;
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useThemeColors();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger className="lg:hidden">
                <span className="sr-only">Toggle Sidebar</span>
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
              <RouteBreadcrumbs />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
