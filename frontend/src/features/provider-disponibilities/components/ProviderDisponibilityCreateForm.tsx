import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { useState } from "react";
import { providerDisponibilityFields } from "../configs/provider-disponibility-fields";
import FormError from "@/components/ui/shadcn/form-error";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  providerDisponibilitySchema,
  type ProviderDisponibilityFormData,
} from "../schemas/provider-disponibility.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createProviderDisponibility } from "../services/create-provider-disponibility.service";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

export default function ProviderDisponibilityCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderDisponibilityFormData>({
    resolver: zodResolver(providerDisponibilitySchema),
    defaultValues: {
      providerDisponibilityName: "",
      providerDisponibilityDescription: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: ProviderDisponibilityFormData) =>
      createProviderDisponibility(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Disponibilité fournisseur"));
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROVIDER_DISPONIBILITIES,
      });

      navigate({
        to: "/pilotages/provider-disponibilities",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: ProviderDisponibilityFormData) => {
    createMutation.mutate(data);
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

      {providerDisponibilityFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
        >
          {field.component === "input" && (
            <Input
              type={field.type}
              className="block w-full"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
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
        isLoading={createMutation.isPending}
        onCancel={() =>
          navigate({
            to: "/pilotages/provider-disponibilities",
            search: { page: 1 },
          })
        }
      />
    </form>
  );
}
