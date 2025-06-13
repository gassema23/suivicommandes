import { Input } from "@/components/ui/shadcn/input";
import FormError from "@/components/ui/shadcn/form-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Provider } from "@/shared/providers/types/provider.type";
import {
  providerSchema,
  type ProviderFormData,
} from "../schemas/provider.schema";
import { updateProvider } from "../services/update-provider.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { providerFields } from "../configs/provider-fields";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

interface ProviderFormProps {
  provider: Provider;
}

export default function ProviderUpdateForm({ provider }: ProviderFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      providerName: provider.providerName ?? "",
      providerCode: provider.providerCode ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateProviderMutation = useMutation({
    mutationFn: (data: ProviderFormData) => updateProvider(provider.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.update("Fournisseur"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDERS });
      navigate({ to: "/pilotages/providers", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: ProviderFormData) => {
    updateProviderMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

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
        isLoading={updateProviderMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/providers", search: { page: 1 } })
        }
      />
    </form>
  );
}
