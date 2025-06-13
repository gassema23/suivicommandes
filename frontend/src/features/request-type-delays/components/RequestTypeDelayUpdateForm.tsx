import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  requestTypeDelaySchema,
  type RequestTypeDelayFormData,
} from "../schemas/request-type-delay.schema";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";
import { FormActions } from "@/components/forms/components/FormActions";
import DateSlider from "@/components/ui/quebec/DateSlider";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import InputContainer from "@/components/forms/components/InputContainer";
import { requestTypeDelayFields } from "../configs/request-type-delay-fields";
import FormError from "@/components/ui/shadcn/form-error";
import type { RequestTypeDelay } from "../types/request-type-delay.type";
import { updateRequestTypeDelay } from "../services/update-request-type-delay.service";

import { getRequestTypeServiceCategoryByServiceCategory } from "@/shared/request-type-service-categories/services/get-request-type-service-category-by-service-category.service";
import { fetchDelayTypesList } from "@/shared/delay-types/services/fetch-delay-types-list.service";
import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { fetchServiceCategoriesByService } from "@/shared/service-categories/services/fetch-service-category-by-service.service";

interface RequestTypeDelayFormProps {
  requestTypeDelay: RequestTypeDelay;
}

export default function RequestTypeDelayUpdateForm({
  requestTypeDelay,
}: RequestTypeDelayFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RequestTypeDelayFormData>({
    resolver: zodResolver(requestTypeDelaySchema),
    defaultValues: {
      requestTypeServiceCategoryId:
        requestTypeDelay.requestTypeServiceCategory.id,
      sectorId:
        requestTypeDelay.requestTypeServiceCategory.serviceCategory.service
          .sector.id,
      serviceId:
        requestTypeDelay.requestTypeServiceCategory.serviceCategory.service.id,
      serviceCategoryId:
        requestTypeDelay.requestTypeServiceCategory.serviceCategory.id,
      delayTypeId: requestTypeDelay.delayType.id,
      delayValue: requestTypeDelay.delayValue || 0,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: RequestTypeDelayFormData) =>
      updateRequestTypeDelay(requestTypeDelay.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REQUEST_TYPE_DELAYS,
      });
      toast.success(SUCCESS_MESSAGES.update("Délai par type de demande"));
      navigate({
        to: "/pilotages/request-type-delays",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(
        error.message ||
          "Une erreur est survenue lors de la mise à jour du délai. Veuillez réessayer."
      );
    },
  });
  const onSubmit = (data: RequestTypeDelayFormData) => {
    updateMutation.mutate(data);
  };

  const sectorId = watch("sectorId");
  const serviceId = watch("serviceId");
  const serviceCategoryId = watch("serviceCategoryId");

  const {
    data: sectors = [],
    isLoading: isLoadingSectors,
    isError: isErrorSectors,
  } = useQuery({
    queryKey: QUERY_KEYS.SECTORS_LISTS,
    queryFn: fetchSectorsList,
  });

  const {
    data: delayTypes = [],
    isLoading: isLoadingDelayTypes,
    isError: isErrorDelayTypes,
  } = useQuery({
    queryKey: QUERY_KEYS.DELAY_TYPES,
    queryFn: fetchDelayTypesList,
  });

  const {
    data: services = [],
    isLoading: isLoadingServices,
    isError: isErrorServices,
  } = useDependentQuery(
    QUERY_KEYS.SERVICE_BY_SECTOR(sectorId),
    fetchServicesBySector,
    sectorId
  );

  const {
    data: serviceCategories = [],
    isLoading: isLoadingServiceCategories,
    isError: isErrorServiceCategories,
  } = useDependentQuery(
    QUERY_KEYS.SERVICE_CATEGORY_BY_SERVICE(serviceId),
    fetchServiceCategoriesByService,
    serviceId
  );

  const {
    data: requestTypeByServiceCategory = [],
    isLoading: isLoadingRequestTypeByServiceCategory,
    isError: isErrorRequestTypeByServiceCategory,
  } = useDependentQuery(
    QUERY_KEYS.REQUEST_TYPES_BY_SERVICE_CATEGORY(serviceCategoryId),
    getRequestTypeServiceCategoryByServiceCategory,
    serviceCategoryId
  );

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && (
        <FormError
          title="Erreur lors de la mise à jour du délai"
          message={backendError}
        />
      )}

      {requestTypeDelayFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name as keyof RequestTypeDelayFormData]?.message}
          htmlFor={field.name}
        >
          {field.component === "select-sector" && (
            <DependentSelect
              value={sectorId}
              onChange={(value) => {
                setValue("sectorId", value);
                setValue("serviceId", "");
                setValue("serviceCategoryId", "");
                setValue("requestTypeServiceCategoryId", "");
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
                setValue("requestTypeServiceCategoryId", "");
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
              onChange={(value) => {
                setValue("serviceCategoryId", value);
                setValue("requestTypeServiceCategoryId", "");
              }}
              data={serviceCategories}
              isLoading={isLoadingServiceCategories}
              isError={isErrorServiceCategories}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.serviceCategoryName}
            />
          )}
          {field.component === "select-request-type-service-category" && (
            <DependentSelect
              value={watch("requestTypeServiceCategoryId")}
              onChange={(value) =>
                setValue("requestTypeServiceCategoryId", value)
              }
              data={requestTypeByServiceCategory}
              isLoading={isLoadingRequestTypeByServiceCategory}
              isError={isErrorRequestTypeByServiceCategory}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.requestType.requestTypeName || "N/A"}
            />
          )}
          {field.component === "select-delay-type" && (
            <DependentSelect
              value={watch("delayTypeId")}
              onChange={(value) => setValue("delayTypeId", value)}
              data={delayTypes}
              isLoading={isLoadingDelayTypes}
              isError={isErrorDelayTypes}
              placeholder={field.placeholder}
              getOptionValue={(s: { id: string; delayTypeName: string }) =>
                s.id
              }
              getOptionLabel={(s: { id: string; delayTypeName: string }) =>
                s.delayTypeName
              }
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
