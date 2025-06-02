import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Package,
  Users,
  BarChart2,
  Settings,
  Home,
  ShoppingCart,
  UserCircle,
} from "lucide-react";
import { UserInfo } from "@/components/user-info";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/",
  },
  {
    title: "Produtos",
    icon: Package,
    url: "/produtos",
  },
  {
    title: "Clientes",
    icon: Users,
    url: "/clientes",
  },
  {
    title: "Nova Compra",
    icon: ShoppingCart,
    url: "/nova-compra",
  },
  {
    title: "Relatórios",
    icon: BarChart2,
    url: "/relatorios",
  },
  {
    title: "Usuários",
    icon: UserCircle,
    url: "/usuarios",
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/configuracoes",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex justify-center">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Omnix</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        location.pathname === item.url
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2 py-4 border-t flex justify-center">
        <UserInfo />
      </SidebarFooter>
    </Sidebar>
  );
}
