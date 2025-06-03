import UserMenu from "@/features/navigations/components/UserMenu";
import { SidebarTrigger } from "../shadcn/sidebar";
import { ThemeToggle } from "./ThemeToogle";
import { Search } from "lucide-react";

export function QuebecHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <SidebarTrigger />

          <div className="flex items-center gap-4">
            <button
              className="text-primary-foreground hover:text-primary-foreground/80"
              aria-label="Rechercher"
            >
              <div>
                <Search className="w-5 h-5" />
              </div>
            </button>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
