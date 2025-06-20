import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { FormActions } from "@/components/forms/components/FormActions";
import {
  deliverableDelayRequestTypeSchema,
  type DeliverableDelayRequestTypeFormData,
} from "../schemas/deliverable-delay-request-type.schema";
import InputContainer from "@/components/forms/components/InputContainer";
import { deliverableDelayRequestTypeFields } from "../configs/deliverable-delay-request-type-fields";
import FormError from "@/components/ui/shadcn/form-error";
import { formatErrorMessage, getFieldError } from "@/lib/utils";
import { getRequestTypeServiceCategoryByServiceCategory } from "@/shared/request-type-service-categories/services/get-request-type-service-category-by-service-category.service";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";
import { fetchServiceCategoriesByService } from "@/shared/service-categories/services/fetch-service-category-by-service.service";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDeliverablesList } from "@/shared/deliverable/services/fetch-deliverable-list.service";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { updateDeliverableDelayRequestType } from "../services/update-deliverable-delay-request-type.service";
import type { DeliverableDelayRequestType } from "@/shared/deliverable-delay-request-types/types/deliverable-delay-request-type.type";

interface DeliverableDelayRequestTypeUpdateFormProps {
  deliverableDelayRequestType: DeliverableDelayRequestType;
}

export default function DeliverableDelayRequestTypeUpdateForm({
  deliverableDelayRequestType,
}: DeliverableDelayRequestTypeUpdateFormProps) {

  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<DeliverableDelayRequestTypeFormData>({
    resolver: zodResolver(deliverableDelayRequestTypeSchema),
    defaultValues: {
      deliverableId: deliverableDelayRequestType.deliverable.id,
      requestTypeServiceCategoryId:
        deliverableDelayRequestType.requestTypeServiceCategory.id,
      sectorId:
        deliverableDelayRequestType.requestTypeServiceCategory.serviceCategory
          .service.sector.id,
      serviceId:
        deliverableDelayRequestType.requestTypeServiceCategory.serviceCategory
          .service.id,
      serviceCategoryId:
        deliverableDelayRequestType.requestTypeServiceCategory.serviceCategory
          .id,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: DeliverableDelayRequestTypeFormData) =>
      updateDeliverableDelayRequestType(deliverableDelayRequestType.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DELIVERABLE_DELAY_RQUEST_TYPES,
      });
      toast.success(
        SUCCESS_MESSAGES.update("Type de demande de délai de livraison")
      );
      navigate({
        to: "/pilotages/deliverable-delay-request-types",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: DeliverableDelayRequestTypeFormData) => {
    createMutation.mutate(data);
  };

  const sectorId = watch("sectorId");
  const serviceId = watch("serviceId");
  const serviceCategoryId = watch("serviceCategoryId");

  const {
    data: deliverables,
    isLoading: isLoadingDeliverables,
    isError: isErrorDeliverables,
  } = useQuery({
    queryKey: QUERY_KEYS.DELIVERABLES_LISTS,
    queryFn: fetchDeliverablesList,
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

  const {
    data: requestTypeServiceCategories,
    isLoading: isLoadingRequestTypeServiceCategories,
    isError: isErrorRequestTypeServiceCategories,
  } = useDependentQuery(
    QUERY_KEYS.REQUEST_TYPE_SERVICE_CATEGORY_BY_SERVICE_CATEGORY(
      serviceCategoryId
    ),
    getRequestTypeServiceCategoryByServiceCategory,
    serviceCategoryId
  );

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {deliverableDelayRequestTypeFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<DeliverableDelayRequestTypeFormData>(
            errors,
            field.name as keyof DeliverableDelayRequestTypeFormData
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
              data={requestTypeServiceCategories}
              isLoading={isLoadingRequestTypeServiceCategories}
              isError={isErrorRequestTypeServiceCategories}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.requestType.requestTypeName}
            />
          )}
          {field.component === "select-deliverable" && (
            <DependentSelect
              value={watch("deliverableId")}
              onChange={(value) => setValue("deliverableId", value)}
              data={deliverables}
              isLoading={isLoadingDeliverables}
              isError={isErrorDeliverables}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.deliverableName}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={createMutation.isPending}
        onCancel={() =>
          navigate({
            to: "/pilotages/deliverable-delay-request-types",
            search: { page: 1 },
          })
        }
      />
    </form>
  );
}
