import { NavigationTabs } from "@/components/ui/quebec/NavigationTabs";
import type { Role } from "@/shared/roles/types/role.type";
import RoleCard from "./RoleCard";
import { capitalizeFirstLetter } from "@/lib/utils";

export function RoleList({ roles }: { roles: Role[] }) {
  const tabs = roles.map((role) => {
    const hasPermission = (resource: string, action: string) => {
      const perm = role.permissions.find(
        (p) => p.resource === resource.toLowerCase()
      );
      return perm?.actions.includes(action.toLowerCase()) ?? false;
    };

    const handleDelete = (roleId: string) => {
      if (confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) {
        console.log(`Suppression du rôle avec l'ID: ${roleId}`);
      }
    };

    return {
      id: role.id,
      label: capitalizeFirstLetter(role.roleName),
      content: () => (
        <RoleCard
          role={role}
          handleDelete={() => handleDelete(role.id)}
          hasPermission={hasPermission}
        />
      ),
    };
  });

  return <NavigationTabs defaultTab={tabs[0]?.id} tabs={tabs} />;
}
