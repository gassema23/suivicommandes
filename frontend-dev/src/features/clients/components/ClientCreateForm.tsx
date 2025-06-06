import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { clientSchema, type ClientFormData } from "../schemas/clients.schema";
import { createClient } from "../services/create-client.service";
import { QUERY_KEYS } from "@/config/query-key";
import { toast } from "sonner";
import { FormActions } from "@/features/common/forms/components/FormActions";
import InputContainer from "@/features/common/forms/components/InputContainer";
import { clientFields } from "../configs/client-fields";

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
      toast.success("Client créé avec succès");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
      navigate({ to: "/pilotages/clients", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
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
      {backendError && (
        <FormError
          title="Erreur lors de l'envoie du formulaire"
          message={backendError}
        />
      )}

      {clientFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
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
        isLoading={createMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/clients", search: { page: 1 } })
        }
      />
    </form>
  );
}
