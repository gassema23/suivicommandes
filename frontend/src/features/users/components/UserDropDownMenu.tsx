import { Button } from "@/components/ui/quebec/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function UserDropDownMenu({ userId }: { userId: string }) {
  console.warn("UserDropDownMenu rendered for userId:", userId);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Modifier l'équipe</DropdownMenuItem>
        <DropdownMenuItem>Modifier le rôle</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive hover:bg-destructive focus:bg-destructive">
          Désactiver
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
