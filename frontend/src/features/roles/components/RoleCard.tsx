import { Button } from "@/components/ui/quebec/Button";
import { Edit, Trash2 } from "lucide-react";
import { RolePermissionsTable } from "./RolePermissionsTable";
import { ACTIONS } from "@/shared/authorizations/types/auth.types";
import { Link } from "@tanstack/react-router";
import { PermissionGate } from "@/shared/authorizations/components/PermissionGate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/quebec/Card";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Role } from "@/shared/roles/types/role.type";

type RoleCardProps = {
  role: Role;
  handleDelete: (id: string) => void;
  hasPermission: (permission: string) => boolean;
};

export default function RoleCard({
  role,
  handleDelete,
  hasPermission,
}: RoleCardProps) {
  return (
    <Card key={role.id} elevation={1}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {capitalizeFirstLetter(role.roleName)}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <PermissionGate resource="roles" action="update">
              <Button variant="outline" size="sm" asChild>
                <Link
                  to={`/administrations/roles/update/$id`}
                  params={{ id: role.id }}
                >
                  
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
          actions={[...ACTIONS]}
          hasPermission={hasPermission}
        />
      </CardContent>
    </Card>
  );
}
