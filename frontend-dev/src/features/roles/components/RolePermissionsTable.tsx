import { Check, X } from "lucide-react";
import type { Role } from "../types/role.type";
import { capitalizeFirstLetter } from "@/lib/utils";

export function RolePermissionsTable({
  permissions,
  actions,
  hasPermission,
}: {
  permissions: Role["permissions"];
  actions: string[];
  hasPermission: (resource: string, action: string) => boolean;
}) {
  const sortedActions = [...actions].sort();
  const sortedPermissions = [...permissions].sort((a, b) =>
    a.resource.localeCompare(b.resource)
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Ressource</th>
            {sortedActions.map((action) => (
              <th key={action} className="text-center p-2 last:pr-0">
                <div className="bg-foreground text-muted px-4 py-2 rounded-md text-sm font-medium">
                  {capitalizeFirstLetter(action)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPermissions.map((permission, index) => (
            <tr
              key={permission.resource}
              className={index % 2 === 0 ? "bg-muted/50" : ""}
            >
              <td className="p-3 font-medium">
                {capitalizeFirstLetter(permission.resource)}
              </td>
              {sortedActions.map((action) => (
                <td key={action} className="text-center p-3">
                  {hasPermission(permission.resource, action) ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-success rounded-full">
                      <Check className="w-4 h-4 text-muted" />
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-destructive rounded-full">
                      <X className="w-4 h-4 text-muted" />
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
