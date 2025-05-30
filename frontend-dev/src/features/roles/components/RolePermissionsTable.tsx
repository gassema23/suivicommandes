import { Check } from "lucide-react";
import type { Role } from "../types/role.type";

export function RolePermissionsTable({
  permissions,
  actions,
  hasPermission,
}: {
  permissions: Role["permissions"];
  actions: string[];
  hasPermission: (resource: string, action: string) => boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">Ressource</th>
            {actions.map((action) => (
              <th key={action} className="text-center p-2 last:pr-0">
                <div className="bg-foreground text-muted px-4 py-2 rounded-md text-sm font-medium capitalize">
                  {action}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission, index) => (
            <tr
              key={permission.resource}
              className={index % 2 === 0 ? "bg-muted/50" : ""}
            >
              <td className="p-3 font-medium capitalize">
                {permission.resource}
              </td>
              {actions.map((action) => (
                <td key={action} className="text-center p-3">
                  {hasPermission(permission.resource, action) && (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-success rounded-full">
                      <Check className="w-4 h-4 text-muted" />
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