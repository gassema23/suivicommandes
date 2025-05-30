import { z } from "zod";

const RESERVED_ROLE_NAMES = [ 'root', 'system'];
const VALID_ACTIONS = ['read', 'create', 'update', 'delete', 'import','export'] as const;

export const createRoleSchema = z.object({
  roleName: z
    .string()
    .min(2, "Le nom du rôle doit contenir au moins 2 caractères")
    .max(50, "Le nom du rôle ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-Z0-9_-]+$/, "Le nom du rôle ne peut contenir que des lettres, chiffres, tirets et underscores")
    .refine(
      (name) => !RESERVED_ROLE_NAMES.includes(name.toLowerCase()),
      "Ce nom de rôle est réservé et ne peut pas être utilisé"
    )
    .transform(val => val.toLowerCase()),
  
  permissions: z
    .array(
      z.object({
        resource: z.string(),
        actions: z
          .array(z.enum(VALID_ACTIONS))
          .min(1, "Au moins une action doit être sélectionnée")
          .refine(
            (actions) => new Set(actions).size === actions.length,
            "Actions dupliquées détectées"
          )
      })
    )
    .min(1, "Au moins une permission doit être attribuée")
    .refine(
      (permissions) => {
        // Vérifier qu'il n'y a pas de ressources dupliquées
        const resources = permissions.map(p => p.resource);
        return new Set(resources).size === resources.length;
      },
      "Ressources dupliquées détectées"
    )
})
.refine(
  (data) => {
    // Validation globale : un rôle ne peut pas avoir toutes les permissions admin
    const hasAllAdminPermissions = data.permissions.every(p => 
      (p.actions.includes('create') && p.actions.includes('update') && p.actions.includes('delete'))
    );
    if (hasAllAdminPermissions && data.roleName !== 'admin') {
      return false;
    }
    return true;
  },
  {
    message: "Un rôle avec toutes les permissions d'administration doit être nommé 'admin'",
    path: ["roleName"]
  }
);

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;