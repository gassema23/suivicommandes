import { useState } from "react";
import type { ProviderDisponibility } from "../types/provider-disponibility.type";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  providerDisponibilitySchema,
  type ProviderDisponibilityFormData,
} from "../schemas/provider-disponibility.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProviderDisponibility } from "../services/update-provider-disponibility.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import FormError from "@/components/ui/shadcn/form-error";
import InputContainer from "@/components/forms/components/InputContainer";
import { providerDisponibilityFields } from "../configs/provider-disponibility-fields";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { FormActions } from "@/components/forms/components/FormActions";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage } from "@/lib/utils";

interface ProviderDisponibilityFormProps {
  providerDisponibility: ProviderDisponibility;
}
export default function ProviderDisponibilityUpdateForm({
  providerDisponibility,
}: ProviderDisponibilityFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderDisponibilityFormData>({
    resolver: zodResolver(providerDisponibilitySchema),
    defaultValues: {
      providerDisponibilityName:
        providerDisponibility.providerDisponibilityName ?? "",
      providerDisponibilityDescription:
        providerDisponibility.providerDisponibilityDescription ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: ProviderDisponibilityFormData) =>
      updateProviderDisponibility(providerDisponibility.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Disponibilité fournisseur"));
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROVIDER_DISPONIBILITIES,
      });
      navigate({
        to: "/pilotages/provider-disponibilities",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: ProviderDisponibilityFormData) => {
    updateMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {providerDisponibilityFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
          required={field.required}
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
        isLoading={updateMutation.isPending}
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
