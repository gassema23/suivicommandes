import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/quebec/Card";
import type { Role } from "../types/role.type";
import { Button } from "@/components/ui/quebec/Button";
import { Edit, Trash2 } from "lucide-react";
import { RolePermissionsTable } from "./RolePermissionsTable";
import { ACTIONS } from "@/features/authorizations/types/auth.types";
import { Link } from "@tanstack/react-router";
import { PermissionGate } from "@/features/authorizations/components/PermissionGate";

export function RoleList({ roles }: { roles: Role[] }) {
  return (
    <div className="grid gap-y-6">
      {roles.map((role) => {
        // Fonction utilitaire pour vérifier une permission pour ce rôle
        const hasPermission = (resource: string, action: string) => {
          const perm = role.permissions.find(
            (p) => p.resource === resource.toLowerCase()
          );
          return perm?.actions.includes(action.toLowerCase()) ?? false;
        };

        const handleDelete = (roleId: string) => {
          if (confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
            // Logique de suppression du rôle
            console.log(`Suppression du rôle avec l'ID: ${roleId}`);
            // Ici, vous pouvez appeler une fonction pour supprimer le rôle via une API ou autre
          }
        };

        return (
          <Card key={role.id} elevation={1}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 capitalize">
                    {role.roleName}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <PermissionGate resource="roles" action="update">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/administrations/roles/update/${role.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource="roles" action="delete">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleDelete(role.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </PermissionGate>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RolePermissionsTable
                permissions={role.permissions}
                actions={ACTIONS}
                hasPermission={hasPermission}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
