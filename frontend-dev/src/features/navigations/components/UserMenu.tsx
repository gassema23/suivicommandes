import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/loader/Spinner";
import UserAvatar from "../../../components/ui/quebec/UserAvatar";
import { useAuth } from "@/providers/auth.provider";

export default function UserMenu() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
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
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
