import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import { DateRangeProvider } from "@/context/date-range-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSettingsProvider } from "@/context/theme-settings-context";

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ThemeSettingsProvider>
          <TooltipProvider>
            <DateRangeProvider>{children}</DateRangeProvider>
          </TooltipProvider>
        </ThemeSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
