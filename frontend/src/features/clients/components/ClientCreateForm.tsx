import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { clientSchema, type ClientFormData } from "../schemas/clients.schema";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { clientFields } from "../configs/client-fields";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";
import { createClient } from "../services/create-client.service";

export default function ClientCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      clientName: "",
      clientNumber: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: ClientFormData) => createClient(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Client"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
      navigate({ to: "/pilotages/clients", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: ClientFormData) => {
    createMutation.mutate(data);
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
          />
        </InputContainer>
      ))}

      <FormActions
        isLoading={createMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/clients", search: { page: 1 } })
        }
      />
    </form>
  );
}
