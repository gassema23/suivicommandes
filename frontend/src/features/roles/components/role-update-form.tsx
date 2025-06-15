import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { ACTIONS } from "@/shared/authorizations/types/auth.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/quebec/Card";
import { Button } from "@/components/ui/quebec/Button";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import { PermissionMatrix } from "./PermissionMatrix";
import { usePermissionMatrix } from "../hooks/usePermissionMatrix";
import {
  createRoleSchema,
  type CreateRoleFormData,
} from "../schemas/role.schema";
import type { Role } from "@/shared/roles/types/role.type";
import { updateRole } from "../services/update-role.service";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { API_ROUTE } from "@/constants/api-route.constant";

// Fetch resources depuis le backend
const fetchResources = async (): Promise<
  { value: string; label: string }[]
> => {
  const res = await fetch(`${API_ROUTE}/roles/resources/`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des ressources");
  return res.json();
};

interface RoleUpdateFormProps {
  role: Role;
}

export default function RoleUpdateForm({ role }: RoleUpdateFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [backendError, setBackendError] = useState<string | null>(null);
  // Récupération dynamique des ressources
  const {
    data: resourcesRaw = [],
    isLoading: loadingResources,
    error: resourcesError,
  } = useQuery({
    queryKey: QUERY_KEYS.RESOURCE,
    queryFn: fetchResources,
  });
  const resourceValues = resourcesRaw.map((r) => r.value);

  // Initialisation du hook permission matrix AVEC les permissions existantes
  const {
    matrix,
    toggleAction,
    toggleResource,
    isActionSelected,
    isResourceFullySelected,
    isResourcePartiallySelected,
    getFormattedPermissions,
    getTotalPermissions,
    setMatrix,
  } = usePermissionMatrix(resourceValues);

  // Initialise la matrice avec les permissions du rôle à éditer
  useEffect(() => {
    if (role && role.permissions) {
      const initialMatrix: Record<string, string[]> = {};
      role.permissions.forEach((perm) => {
        initialMatrix[perm.resource] = perm.actions;
      });
      setMatrix(initialMatrix);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, setMatrix, resourceValues.join(",")]);

  const form = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      roleName: role.roleName,
      permissions: role.permissions,
    },
  });

  // Synchronise les permissions du formulaire avec la matrice
  useEffect(() => {
    form.setValue("permissions", getFormattedPermissions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrix]);

  const sortedActions = [...ACTIONS].sort();
  const sortedResources = [...resourceValues].sort((a, b) =>
    a.localeCompare(b)
  );

  const updateRoleMutation = useMutation({
    mutationFn: (data: CreateRoleFormData) => updateRole(role.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES });
      navigate({ to: "/administrations/roles" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: CreateRoleFormData) => {
    updateRoleMutation.mutate(data);
  };

  if (loadingResources) {
    return <div>Chargement des ressources...</div>;
  }

  if (resourcesError) {
    return (
      <div className="text-destructive">
        Erreur lors du chargement des ressources
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
      {backendError && <FormError message={backendError} />}
      {/* Champ nom du rôle */}
      <Card>
        <CardContent className="pt-6 w-md">
          <div>
            <Label htmlFor="roleName">Nom du rôle *</Label>
            <Input
              id="roleName"
              {...form.register("roleName")}
              placeholder="ex: moderator"
              className={
                form.formState.errors.roleName ? "border-destructive" : ""
              }
            />
            {form.formState.errors.roleName && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.roleName.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions d'accès</CardTitle>
          <p className="text-sm text-muted-foreground">
            {getTotalPermissions()} permission(s) sélectionnée(s)
          </p>
        </CardHeader>
        <CardContent>
          <PermissionMatrix
            resources={sortedResources}
            actions={sortedActions}
            isActionSelected={isActionSelected}
            isResourceFullySelected={(resource) =>
              isResourceFullySelected(resource, sortedActions)
            }
            isResourcePartiallySelected={(resource) =>
              isResourcePartiallySelected(resource, sortedActions)
            }
            onActionToggle={toggleAction}
            onResourceToggle={(resource) =>
              toggleResource(resource, sortedActions)
            }
            disabled={form.formState.isSubmitting}
          />

          {form.formState.errors.permissions && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.permissions.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/administrations/roles" })}
          disabled={form.formState.isSubmitting}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || getTotalPermissions() === 0}
        >
          {form.formState.isSubmitting
            ? "Mise à jour..."
            : "Mettre à jour le rôle"}
        </Button>
      </div>
    </form>
  );
}
