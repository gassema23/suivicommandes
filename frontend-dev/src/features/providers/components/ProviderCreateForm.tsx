import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/shadcn/button";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  providerSchema,
  type ProviderFormData,
} from "../schemas/provider.schema";
import { createProvider } from "../services/create-provider.service";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { toast } from "sonner";
import { FormActions } from "@/features/common/forms/components/FormActions";
import InputContainer from "@/features/common/forms/components/InputContainer";
import { providerFields } from "../configs/provider-fields";
import { SUCCESS_MESSAGES } from "@/features/common/constants/messages.constant";

export default function ProviderCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      providerName: "",
      providerCode: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createProviderMutation = useMutation({
    mutationFn: (data: ProviderFormData) => createProvider(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDERS });
      toast.success(SUCCESS_MESSAGES.create("Fournisseur"));
      navigate({ to: "/pilotages/providers", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: ProviderFormData) => {
    createProviderMutation.mutate(data);
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

      {providerFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
        >
          <Input
            type={field.type}
            className="block w-full"
            id={field.name}
            placeholder={field.placeholder}
            {...register(field.name)}
            required={field.required}
          />
        </InputContainer>
      ))}

      <FormActions
        isLoading={createProviderMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/providers", search: { page: 1 } })
        }
      />
    </form>
  );
}
