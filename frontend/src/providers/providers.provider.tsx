import { ThemeProvider } from "./theme.provider";
import { SidebarProvider } from "@/components/ui/shadcn/sidebar";
import { AuthProvider } from "./auth.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
