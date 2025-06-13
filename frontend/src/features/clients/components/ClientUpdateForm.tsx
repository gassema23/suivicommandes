import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { clientSchema, type ClientFormData } from "../schemas/clients.schema";
import type { Client } from "@/shared/clients/types/client.type";
import { useUpdateClient } from "../services/update-client.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { clientFields } from "../configs/client-fields";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

interface ClientUpdateFormProps {
  client: Client;
}

export default function ClientUpdateForm({ client }: ClientUpdateFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateClient = useUpdateClient();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      clientName: client.clientName ?? "",
      clientNumber: client.clientNumber ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: ClientFormData) => updateClient(client.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
      navigate({ to: "/pilotages/clients", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: ClientFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {clientFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<ClientFormData>(
            errors,
            field.name as keyof ClientFormData
          )}
          htmlFor={field.name}
          required={field.required}
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
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/clients", search: { page: 1 } })
        }
      />
    </form>
  );
}
