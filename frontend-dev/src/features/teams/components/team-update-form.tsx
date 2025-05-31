import { Input } from "@/components/ui/shadcn/input";
import type { Team } from "../types/team.type";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOwners } from "../hooks/fetchOwners";
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
import { teamSchema, type TeamFormData } from "../schemas/team.schema";
import { updateTeam } from "../services/updateTeam";
import FormError from "@/components/ui/shadcn/form-error";
import { useState } from "react";

interface TeamUpdateFormProps {
  team: Team;
}

export default function TeamUpdateForm({ team }: TeamUpdateFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: ownerData = [],
    isLoading: loadingOwners,
    error: ownerError,
  } = useQuery({
    queryKey: ["owners"],
    queryFn: fetchOwners,
  });

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: team.teamName,
      teamDescription: team?.teamDescription ?? "",
      ownerId: team.owner?.id ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const updateTeamMutation = useMutation({
    mutationFn: (data: TeamFormData) => updateTeam(team.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      navigate({ to: "/pilotages/teams" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: TeamFormData) => {
    // Appelle ta mutation ici
    updateTeamMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && (
        <FormError
          title="Erreur lors de l'envoie du formulaire"
          message={backendError}
        />
      )}
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4">Nom de l'équipe</Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="teamName"
            {...register("teamName")}
            required
          />
          {errors.teamName && (
            <p className="text-destructive text-sm mt-1">
              {errors.teamName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4">Description</Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="teamDescription"
            {...register("teamDescription")}
          />
          {errors.teamDescription && (
            <p className="text-destructive text-sm mt-1">
              {errors.teamDescription.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4">Propriétaire</Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="ownerId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent>
                  {loadingOwners ? (
                    <Skeleton className="h-8" />
                  ) : ownerError ? (
                    <div className="px-3 py-2 text-destructive">
                      Erreur de chargement
                    </div>
                  ) : (
                    ownerData.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.fullName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.ownerId && (
            <p className="text-destructive text-sm mt-1">
              {errors.ownerId.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/teams" })}
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
