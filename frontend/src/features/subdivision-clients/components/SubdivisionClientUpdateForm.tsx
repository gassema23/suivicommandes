import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  subdivisionClientSchema,
  type SubdivisionClientFormData,
} from "../schemas/subdivision-client.schema";
import { fetchClients } from "@/shared/clients/services/fetch-client.service";
import type { SubdivisionClient } from "../types/subdivision-client.type";
import { updateSubdivisionClient } from "../services/update-subdivision-client.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { FormActions } from "@/components/forms/components/FormActions";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import InputContainer from "@/components/forms/components/InputContainer";
import { subdivisionClientFields } from "../configs/subdivision-client.fields";

interface SubdivisionClientUpdateFormProps {
  subdivisionClient: SubdivisionClient;
}

export default function SubdivisionClientUpdateForm({
  subdivisionClient,
}: SubdivisionClientUpdateFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: clients,
    isLoading: isLoadingClients,
    isError: isErrorClients,
  } = useQuery({
    queryKey: QUERY_KEYS.CLIENTS_LISTS,
    queryFn: fetchClients,
  });

  const form = useForm<SubdivisionClientFormData>({
    resolver: zodResolver(subdivisionClientSchema),
    defaultValues: {
      subdivisionClientName: subdivisionClient.subdivisionClientName ?? "",
      subdivisionClientNumber: subdivisionClient.subdivisionClientNumber ?? "",
      clientId: subdivisionClient.client.id ?? "",
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: SubdivisionClientFormData) =>
      updateSubdivisionClient(subdivisionClient.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUBDIVISION_CLIENTS,
      });
      navigate({ to: "/pilotages/subdivision-clients", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: SubdivisionClientFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {subdivisionClientFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
          required={field.required}
        >
          {field.component === "select-client" && (
            <DependentSelect
              value={watch("clientId")}
              onChange={(value) => {
                setValue("clientId", value);
              }}
              data={clients}
              isLoading={isLoadingClients}
              isError={isErrorClients}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.virtualClientName}
            />
          )}
          {field.component === "input" && (
            <Input
              type={field.type}
              className="block w-full"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
              required={field.required}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({
            to: "/pilotages/subdivision-clients",
            search: { page: 1 },
          })
        }
      />
    </form>
  );
}
