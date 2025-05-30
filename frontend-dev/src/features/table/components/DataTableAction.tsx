import { Button } from "@/components/ui/quebec/Button";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { PermissionGate } from "@/features/authorizations/components/PermissionGate";
import { useAuth } from "@/providers/auth-provider";
import { Link } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";

interface DataTableActionProps {
  id: string;
  baseUrl: string; // ex: "/settings/roles"
  onDelete?: () => void;
  showPage?: boolean;
  resource?: string;
}

export default function DataTableAction({
  id,
  baseUrl,
  onDelete,
  showPage = false,
  resource,
}: DataTableActionProps) {
  const { hasPermission } = useAuth();
  // Vérifie si l'utilisateur a au moins une permission d'action
  const canView = resource && hasPermission(resource, "view");
  const canUpdate = resource && hasPermission(resource, "update");
  const canDelete = resource && hasPermission(resource, "delete");

  // Si aucune permission, ne rien afficher
  if (!canView && !canUpdate && !canDelete) {
    return null;
  }
  return (
    <div className="flex justify-end mr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="left">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canView && showPage && (
            <DropdownMenuItem asChild>
              <Link to={baseUrl} params={{ id }}>
                Afficher
              </Link>
            </DropdownMenuItem>
          )}
          {canUpdate && (
            <DropdownMenuItem asChild>
              <Link to={baseUrl} params={{ id }}>
                Modifier
              </Link>
            </DropdownMenuItem>
          )}

          {canDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Supprimer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
