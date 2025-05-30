import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/loader/spinner";
import UserAvatar from "./user-avatar";
import { useAuth } from "@/providers/auth-provider";

export default function UserMenu() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  if(!user) {
    return <Spinner className="h-6 w-6" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom" align="end">
        <DropdownMenuLabel>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <>
              <span className="truncate">{user.fullName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
