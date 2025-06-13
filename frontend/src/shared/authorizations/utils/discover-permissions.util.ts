import { API_ROUTE } from "@/constants/api-route.constant";
import type { PermissionCheck, User } from "../types/user.type";

export const discoverBackendPermissions = async (): Promise<void> => {
  try {
    // Récupérer l'utilisateur actuel pour voir ses permissions
    const response = await fetch(`${API_ROUTE}/auth/me`, {
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      const user: User = data.user;
      
      console.log('🔍 Analyse des permissions backend:');
      console.log('Rôle actuel:', user.role.roleName);
      console.log('Permissions disponibles:');
      
      user.role.permissions.forEach((permission, index) => {
        console.log(`${index + 1}. Resource: "${permission.resource}"`);
        console.log(`   Actions: [${permission.actions.map(a => `"${a}"`).join(', ')}]`);
        console.log('');
      });

      // Générer le code des constantes
      const generatedConstants = generatePermissionConstants(user.role.permissions);
      console.log('📋 Constantes générées:');
      console.log(generatedConstants);
    }
  } catch (error) {
    console.error('Erreur lors de la découverte des permissions:', error);
  }
};

export const generatePermissionConstants = (permissions: PermissionCheck[]): string => {
  let output = 'export const PERMISSIONS = {\n';
  
  // Grouper par resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = new Set<string>();
    }
    perm.actions.forEach(action => acc[perm.resource].add(action));
    return acc;
  }, {} as Record<string, Set<string>>);

  Object.entries(groupedPermissions).forEach(([resource, actions]) => {
    const resourceName = resource.toUpperCase();
    output += `  ${resourceName}: {\n`;
    
    Array.from(actions).forEach(action => {
      const actionName = action.toUpperCase();
      output += `    ${actionName}: { resource: '${resource}', action: '${action}' } as PermissionCheck,\n`;
    });
    
    output += `  },\n`;
  });
  
  output += '} as const;';
  return output;
};