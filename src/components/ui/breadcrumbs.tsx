import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  path: string;
  title: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation();

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        "flex items-center space-x-1 text-sm text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isActive = location.pathname === item.path;

        return (
          <div key={item.path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span
                className={cn(
                  "font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "hover:text-foreground transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
