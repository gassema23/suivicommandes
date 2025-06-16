import FormError from "@/components/ui/shadcn/form-error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import DateSlider from "@/components/ui/quebec/DateSlider";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { requestTypeServiceCategoryFields } from "../configs/request-type-service-category-fields";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";
import {
  requestTypeServiceCategorySchema,
  type RequestTypeServiceCategoryFormData,
} from "../schemas/request-type-service-category.schema";
import { updateRequestTypeServiceCategory } from "../services/update-request-type-service-category.service";

import { fetchRequestTypeList } from "@/shared/request-types/services/fetch-request-type-list.service";
import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { fetchServiceCategoriesByService } from "@/shared/service-categories/services/fetch-service-category-by-service.service";
import type { RequestTypeServiceCategory } from "@/shared/request-type-service-categories/types/request-type-service-category.type";
import { formatErrorMessage, getFieldError } from "@/lib/utils";

interface RequestTypeServiceCategoryFormProps {
  requestTypeServiceCategory: RequestTypeServiceCategory;
}

export default function RequestTypeServiceCategoryUpdateForm({
  requestTypeServiceCategory,
}: RequestTypeServiceCategoryFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RequestTypeServiceCategoryFormData>({
    resolver: zodResolver(requestTypeServiceCategorySchema),
    defaultValues: {
      requestTypeId: requestTypeServiceCategory.requestType.id,
      sectorId: requestTypeServiceCategory.serviceCategory.service.sector.id,
      serviceId: requestTypeServiceCategory.serviceCategory.service.id,
      serviceCategoryId: requestTypeServiceCategory.serviceCategory.id,
      availabilityDelay: requestTypeServiceCategory.availabilityDelay || 0,
      minimumRequiredDelay:
        requestTypeServiceCategory.minimumRequiredDelay || 0,
      serviceActivationDelay:
        requestTypeServiceCategory.serviceActivationDelay || 0,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: RequestTypeServiceCategoryFormData) =>
      updateRequestTypeServiceCategory(requestTypeServiceCategory.id, data),
    onSuccess: () => {
      setBackendError(null);
      toast.success(
        SUCCESS_MESSAGES.update("Catégories de services par type de demande")
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REQUEST_TYPE_SERVICE_CATEGORIES,
      });
      navigate({
        to: "/pilotages/request-type-service-categories",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const onSubmit = (data: RequestTypeServiceCategoryFormData) => {
    updateMutation.mutate(data);
  };

  const sectorId = watch("sectorId");
  const serviceId = watch("serviceId");

  const {
    data: requestTypes,
    isLoading: isLoadingRequestTypes,
    isError: isErrorRequestTypes,
  } = useQuery({
    queryKey: QUERY_KEYS.REQUEST_TYPES_LISTS,
    queryFn: fetchRequestTypeList,
  });

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

  const {
    data: serviceCategories,
    isLoading: isLoadingServiceCategories,
    isError: isErrorServiceCategories,
  } = useDependentQuery(
    QUERY_KEYS.SERVICE_CATEGORY_BY_SERVICE(serviceId),
    fetchServiceCategoriesByService,
    serviceId
  );

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {requestTypeServiceCategoryFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<RequestTypeServiceCategoryFormData>(
            errors,
            field.name as keyof RequestTypeServiceCategoryFormData
          )}
          htmlFor={field.name}
        >
          {field.component === "select-sector" && (
            <DependentSelect
              value={sectorId}
              onChange={(value) => {
                setValue("sectorId", value);
                setValue("serviceId", "");
                setValue("serviceCategoryId", "");
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
              value={serviceId}
              onChange={(value) => {
                setValue("serviceId", value);
                setValue("serviceCategoryId", "");
              }}
              data={services}
              isLoading={isLoadingServices}
              isError={isErrorServices}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.serviceName}
            />
          )}
          {field.component === "select-service-category" && (
            <DependentSelect
              value={watch("serviceCategoryId")}
              onChange={(value) => setValue("serviceCategoryId", value)}
              data={serviceCategories}
              isLoading={isLoadingServiceCategories}
              isError={isErrorServiceCategories}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.serviceCategoryName}
            />
          )}

          {field.component === "select-request-type" && (
            <DependentSelect
              value={watch("requestTypeId")}
              onChange={(value) => setValue("requestTypeId", value)}
              data={requestTypes}
              isLoading={isLoadingRequestTypes}
              isError={isErrorRequestTypes}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.requestTypeName}
            />
          )}
          {field.component === "slider" && (
            <Controller
              control={form.control}
              name={field.name}
              render={({ field: { value, onChange, name } }) => (
                <DateSlider value={value} onChange={onChange} name={name} />
              )}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({
            to: "/pilotages/request-type-service-categories",
            search: { page: 1 },
          })
        }
      />
    </form>
  );
}
