import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import FormError from "@/components/ui/shadcn/form-error";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { formatErrorMessage, getFieldError } from "@/lib/utils";
import { getRequestTypeServiceCategoryByServiceCategory } from "@/shared/request-type-service-categories/services/get-request-type-service-category-by-service-category.service";
import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { fetchServiceCategoriesByService } from "@/shared/service-categories/services/fetch-service-category-by-service.service";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { deliverableDelayFlowFields } from "../configs/deliverable-delay-flow-fields";
import {
  deliverableDelayFlowSchema,
  type DeliverableDelayFlowFormData,
} from "../schemas/deliverable-delay-flow.schema";
import { getDeliverableDelayRequestTypeByRequestTypeServiceCategory } from "@/shared/request-type-service-categories/services/get-deliverable-delay-request-type-by-request-type-service-category.service";
import { fetchFlowsList } from "@/shared/flow/types/services/fetch-flows-list.service";
import type { DeliverableDelayFlow } from "@/shared/deliverable-delay-flows/types/deliverable-delay-flow.type";
import { updateDeliverableDelayFlow } from "../services/update-deliverable-delay-flow.service";

interface DeliverableDelayFlowFormProps {
  deliverableDelayFlow: DeliverableDelayFlow;
}

export default function DeliverableDelayFlowUpdateForm({
  deliverableDelayFlow,
}: DeliverableDelayFlowFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<DeliverableDelayFlowFormData>({
    resolver: zodResolver(deliverableDelayFlowSchema),
    defaultValues: {
      flowId: deliverableDelayFlow.flow?.id ?? "",
      requestTypeServiceCategoryId:
        deliverableDelayFlow.deliverableDelayRequestType
          .requestTypeServiceCategory?.id ?? "",
      sectorId:
        deliverableDelayFlow.deliverableDelayRequestType
          ?.requestTypeServiceCategory?.serviceCategory?.service?.sector?.id ??
        "",
      serviceId:
        deliverableDelayFlow.deliverableDelayRequestType
          ?.requestTypeServiceCategory?.serviceCategory?.service?.id ?? "",
      serviceCategoryId:
        deliverableDelayFlow.deliverableDelayRequestType
          ?.requestTypeServiceCategory?.serviceCategory?.id ?? "",
      deliverableDelayRequestTypeId:
        deliverableDelayFlow.deliverableDelayRequestType?.id ?? "",
    },
  });
  
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const createMutation = useMutation({
    mutationFn: (data: DeliverableDelayFlowFormData) =>
      updateDeliverableDelayFlow(deliverableDelayFlow.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DELIVERABLE_DELAY_RQUEST_TYPES,
      });
      toast.success(
        SUCCESS_MESSAGES.update("Type de demande de délai de livraison")
      );
      navigate({
        to: "/pilotages/deliverable-delay-flows",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });
  const onSubmit = (data: DeliverableDelayFlowFormData) => {
    createMutation.mutate(data);
  };

  const sectorId = watch("sectorId");
  const serviceId = watch("serviceId");
  const serviceCategoryId = watch("serviceCategoryId");
  const requestTypeServiceCategoryId = watch("requestTypeServiceCategoryId");

  const {
    data: flows,
    isLoading: isLoadingFlows,
    isError: isErrorFlows,
  } = useQuery({
    queryKey: QUERY_KEYS.FLOWS_LISTS,
    queryFn: fetchFlowsList,
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
  // Deliverable delay request type
  const {
    data: deliverableDelayRequestTypes,
    isLoading: isLoadingDeliverableDelayRequestTypes,
    isError: isErrorDeliverableDelayRequestTypes,
  } = useDependentQuery(
    QUERY_KEYS.DELIVERABLE_DELAY_REQUEST_TYPE_BY_REQUEST_TYPE_SERVICE_CATEGORY(
      requestTypeServiceCategoryId
    ),
    getDeliverableDelayRequestTypeByRequestTypeServiceCategory,
    requestTypeServiceCategoryId
  );

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {deliverableDelayFlowFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={getFieldError<DeliverableDelayFlowFormData>(
            errors,
            field.name as keyof DeliverableDelayFlowFormData
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
                setValue("deliverableDelayRequestTypeId", "");
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
                setValue("deliverableDelayRequestTypeId", "");
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
                setValue("deliverableDelayRequestTypeId", "");
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
              onChange={(value) => {
                setValue("requestTypeServiceCategoryId", value);
                setValue("deliverableDelayRequestTypeId", "");
              }}
              data={requestTypeServiceCategories}
              isLoading={isLoadingRequestTypeServiceCategories}
              isError={isErrorRequestTypeServiceCategories}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.requestType.requestTypeName}
            />
          )}

          {field.component === "select-deliverable-delay-request-type" && (
            <DependentSelect
              value={watch("deliverableDelayRequestTypeId")}
              onChange={(value) =>
                setValue("deliverableDelayRequestTypeId", value)
              }
              data={deliverableDelayRequestTypes}
              isLoading={isLoadingDeliverableDelayRequestTypes}
              isError={isErrorDeliverableDelayRequestTypes}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.deliverable.deliverableName}
            />
          )}

          {field.component === "select-flow" && (
            <DependentSelect
              value={watch("flowId")}
              onChange={(value) => setValue("flowId", value)}
              data={flows}
              isLoading={isLoadingFlows}
              isError={isErrorFlows}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.flowName}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={createMutation.isPending}
        onCancel={() =>
          navigate({
            to: "/pilotages/deliverable-delay-flows",
            search: { page: 1 },
          })
        }
      />
    </form>
  );
}
