import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import {
  requestTypeServiceCategorySchema,
  type RequestTypeServiceCategoryFormData,
} from "../schemas/request-type-service-category.schema";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";
import { requestTypeServiceCategoryFields } from "../configs/request-type-service-category-fields";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { fetchRequestTypeList } from "@/shared/request-types/services/fetch-request-type-list.service";
import { createRequestTypeServiceCategory } from "../services/create-request-type-service-category.service";
import DateSlider from "@/components/ui/quebec/DateSlider";

import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { fetchServiceCategoriesByService } from "@/shared/service-categories/services/fetch-service-category-by-service.service";

export default function RequestTypeServiceCategoryCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<RequestTypeServiceCategoryFormData>({
    resolver: zodResolver(requestTypeServiceCategorySchema),
    defaultValues: {
      requestTypeId: "",
      sectorId: "",
      serviceId: "",
      serviceCategoryId: "",
      availabilityDelay: 0,
      minimumRequiredDelay: 0,
      serviceActivationDelay: 0,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: RequestTypeServiceCategoryFormData) =>
      createRequestTypeServiceCategory(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REQUEST_TYPE_SERVICE_CATEGORIES });
      toast.success(
        SUCCESS_MESSAGES.create("Catégories de services par type de demande")
      );
      navigate({
        to: "/pilotages/request-type-service-categories",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: RequestTypeServiceCategoryFormData) => {
    createMutation.mutate(data);
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
      {backendError && (
        <FormError
          title="Erreur lors de l'envoie du formulaire"
          message={backendError}
        />
      )}

      {requestTypeServiceCategoryFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
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
        isLoading={createMutation.isPending}
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
