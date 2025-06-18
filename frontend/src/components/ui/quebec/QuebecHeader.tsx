import UserMenu from "@/components/navigations/components/UserMenu";
import { SidebarTrigger } from "../shadcn/sidebar";
import { ThemeToggle } from "./ThemeToogle";
import HeaderNotification from "@/shared/notifications/components/HeaderNotification";

export function QuebecHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto px-8">
        <div className="flex items-center justify-between py-2">
          <SidebarTrigger />

          <div className="flex items-center gap-4">
            <HeaderNotification />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
