import { Input } from "@/components/ui/shadcn/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/quebec/Button";
import { useNavigate } from "@tanstack/react-router";
import { getRolesList } from "@/shared/roles/services/get-roles.service";
import { userSchema, type UserFormData } from "../schemas/user.schema";
import { useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import { getTeamsList } from "@/shared/teams/services/get-teams-list.service";
import { createUser } from "../services/create-user.service";
import { Label } from "@/components/ui/shadcn/label";
import { capitalizeFirstLetter } from "@/lib/utils";
import { QUERY_KEYS } from "@/constants/query-key.constant";

export default function CreateUserForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: roleData = [],
    isLoading: loadingRoles,
    error: roleError,
  } = useQuery({
    queryKey: QUERY_KEYS.ROLES_LISTS,
    queryFn: getRolesList,
  });

  const {
    data: teamData = [],
    isLoading: loadingTeams,
    error: teamError,
  } = useQuery({
    queryKey: QUERY_KEYS.TEAMS_LISTS,
    queryFn: getTeamsList,
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      teamId: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const updateUserMutation = useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      navigate({ to: "/pilotages/users" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: UserFormData) => {
    updateUserMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="firstName">
          Prénom
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="firstName"
            {...register("firstName")}
            placeholder="Prénom"
            required
          />
          {errors.firstName && (
            <p className="text-destructive text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="lastName">
          Nom de famille
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="lastName"
            {...register("lastName")}
            placeholder="Nom de famille"
            required
          />
          {errors.lastName && (
            <p className="text-destructive text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="email">
          Adresse courriel
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            placeholder="Adresse courriel"
            id="email"
            type="email"
            {...register("email")}
            required
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="roleId">
          Rôle
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="roleId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {loadingRoles ? (
                    <Skeleton className="h-8" />
                  ) : roleError ? (
                    <div className="px-3 py-2 text-destructive">
                      Erreur de chargement
                    </div>
                  ) : (
                    roleData.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {capitalizeFirstLetter(role.roleName)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.roleId && (
            <p className="text-destructive text-sm mt-1">
              {errors.roleId.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="teamId">
          Équipe
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="teamId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une équipe" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTeams ? (
                    <Skeleton className="h-8" />
                  ) : teamError ? (
                    <div className="px-3 py-2 text-destructive">
                      Erreur de chargement
                    </div>
                  ) : (
                    teamData.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.teamName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.roleId && (
            <p className="text-destructive text-sm mt-1">
              {errors.roleId.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/users" })}
          disabled={form.formState.isSubmitting}
        >
          Annuler
        </Button>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
}
