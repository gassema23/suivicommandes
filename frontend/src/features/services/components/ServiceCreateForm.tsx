import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { serviceSchema, type ServiceFormData } from "../schemas/service.schema";
import { useCreateService } from "../services/create-service.service";
import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { serviceFields } from "../configs/service-fields";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

export default function ServiceCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createService = useCreateService();

  const {
    data: sectors = [],
    isLoading: isLoadingSectors,
    isError: isErrorSectors,
  } = useQuery({
    queryKey: QUERY_KEYS.SECTORS_LISTS,
    queryFn: fetchSectorsList,
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      serviceDescription: "",
      sectorId: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const createServiceMutation = useMutation({
    mutationFn: (data: ServiceFormData) => createService(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Service"));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
      navigate({ to: "/pilotages/services", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: ServiceFormData) => {
    createServiceMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {serviceFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<ServiceFormData>(
            errors,
            field.name as keyof ServiceFormData
          )}
          htmlFor={field.name}
          required={field?.required}
        >
          {field.component === "select" && (
            <DependentSelect
              value={watch("sectorId")}
              onChange={(value) => setValue("sectorId", value)}
              data={sectors}
              isLoading={isLoadingSectors}
              isError={isErrorSectors}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.sectorName}
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
        isLoading={createServiceMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/services", search: { page: 1 } })
        }
      />
    </form>
  );
}
