import { Input } from "@/components/ui/shadcn/input";
import type { Team } from "../types/team.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOwners } from "../services/fetch-owners.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { teamSchema, type TeamFormData } from "../schemas/team.schema";
import { updateTeam } from "../services/update-team.service";
import FormError from "@/components/ui/shadcn/form-error";
import { useState } from "react";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { teamFields } from "../configs/team-fields";
import InputContainer from "@/features/common/forms/components/InputContainer";
import { DependentSelect } from "@/features/common/dependant-select/components/DependentSelect";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/features/common/constants/messages.constant";
import { FormActions } from "@/features/common/forms/components/FormActions";

interface TeamUpdateFormProps {
  team: Team;
}

export default function TeamUpdateForm({ team }: TeamUpdateFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: owners = [],
    isLoading: isLoadingOwners,
    isError: isErrorOwners,
  } = useQuery({
    queryKey: QUERY_KEYS.OWNER_LISTS,
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
    watch,
    setValue,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: TeamFormData) => updateTeam(team.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Équipe"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAMS });
      navigate({ to: "/pilotages/teams", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: TeamFormData) => {
    updateMutation.mutate(data);
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

      {teamFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
        >
          {field.component === "select" && (
            <DependentSelect
              value={watch("ownerId")}
              onChange={(value) => setValue("ownerId", value)}
              data={owners}
              isLoading={isLoadingOwners}
              isError={isErrorOwners}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.fullName}
            />
          )}
          {field.component === "input" && (
            <Input
              type={field.type}
              className="block w-full"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
              required
            />
          )}
          {field.component === "textarea" && (
            <Textarea
              rows={field.rows}
              className="block w-full"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/teams", search: { page: 1 } })
        }
      />
    </form>
  );
}
