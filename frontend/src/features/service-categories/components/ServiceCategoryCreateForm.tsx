import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  serviceCategorySchema,
  type ServiceCategoryFormData,
} from "../schemas/service-category.schema";
import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { useCreateServiceCategory } from "../services/create-service-category.service";
import { Switch } from "@/components/ui/shadcn/switch";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { serviceCategoryFields } from "../configs/service-category-fields";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

export default function ServiceCategoryCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createServiceCategory = useCreateServiceCategory();

  const form = useForm<ServiceCategoryFormData>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: {
      serviceCategoryName: "",
      serviceCategoryDescription: "",
      sectorId: "",
      serviceId: "",
      isMultiLink: false,
      isMultiProvider: false,
      isRequiredExpertise: false,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const createServiceCategoryMutation = useMutation({
    mutationFn: (data: ServiceCategoryFormData) => createServiceCategory(data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(SUCCESS_MESSAGES.create("Catégorie de service"));
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SERVICE_CATEGORIES,
      });
      navigate({ to: "/pilotages/service-categories", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: ServiceCategoryFormData) => {
    createServiceCategoryMutation.mutate(data);
  };

  const sectorId = watch("sectorId");

  const {
    data: sectors,
    isLoading: isLoadingSectors,
    isError: isErrorSectors,
  } = useQuery({
    queryKey: QUERY_KEYS.SECTORS_LISTS,
    queryFn: fetchSectorsList,
  });

  const {
    data: services,
    isLoading: isLoadingServices,
    isError: isErrorServices,
  } = useDependentQuery(
    QUERY_KEYS.SERVICE_BY_SECTOR(sectorId),
    fetchServicesBySector,
    sectorId
  );

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {serviceCategoryFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<ServiceCategoryFormData>(
            errors,
            field.name as keyof ServiceCategoryFormData
          )}
          htmlFor={field.name}
          required={field?.required}
        >
          {field.component === "select-sector" && (
            <DependentSelect
              value={watch("sectorId")}
              onChange={(value) => {
                setValue("sectorId", value);
                setValue("serviceId", "");
              }}
              data={sectors}
              isLoading={isLoadingSectors}
              isError={isErrorSectors}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.sectorName}
            />
          )}
          {field.component === "select-service" && (
            <DependentSelect
              value={watch("serviceId")}
              onChange={(value) => setValue("serviceId", value)}
              data={services}
              isLoading={isLoadingServices}
              isError={isErrorServices}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.serviceName}
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
          {field.component === "switch" && (
            <Controller
              control={control}
              name={field.name as keyof ServiceCategoryFormData}
              render={({ field: ctrlField }) => (
                <Switch
                  id={field.name}
                  checked={!!ctrlField.value}
                  onCheckedChange={ctrlField.onChange}
                />
              )}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={createServiceCategoryMutation.isPending}
        onCancel={() =>
          navigate({ to: "/pilotages/service-categories", search: { page: 1 } })
        }
      />
    </form>
  );
}
