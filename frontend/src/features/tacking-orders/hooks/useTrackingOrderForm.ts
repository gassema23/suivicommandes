import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { toast } from "sonner";

import {
  trackingOrderSchema,
  type TrackingOrderFormData,
} from "../schema/tracking-order.schema";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage } from "@/lib/utils";
import { useCalculateDeadline } from "./useCalculateDeadline";
import { useGetDataToCalculateDeadline } from "./useGetDataToCalculateDeadline";

const DEFAULT_VALUES: TrackingOrderFormData = {
  requisitionTypeId: "",
  clientId: "",
  subdivisionClientId: "",
  order_number: "",
  requisition_number: "",
  sectorId: "",
  serviceId: "",
  serviceCategoryId: "",
  requestTypeServiceCategoryId: "",
  requestTypeDelayId: "",
  order_registration_at: "",
  order_registration_time: "",
};

export function useTrackingOrderForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<TrackingOrderFormData>({
    resolver: zodResolver(trackingOrderSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { watch, setValue, reset } = form;

  // Watchers pour les dépendances
  const clientId = watch("clientId");
  const sectorId = watch("sectorId");
  const serviceId = watch("serviceId");
  const serviceCategoryId = watch("serviceCategoryId");
  const requestTypeServiceCategoryId = watch("requestTypeServiceCategoryId");
  const requestTypeDelayId = watch("requestTypeDelayId");
  const order_registration_at = watch("order_registration_at");
  const order_registration_time = watch("order_registration_time");

  const dataToCalculateDeadlineQuery = useGetDataToCalculateDeadline({
    requestTypeServiceCategoryId,
    requestTypeDelayId,
  });

  const processingDeadlineQuery = useCalculateDeadline({
    startDate: order_registration_at,
    startTime: order_registration_time,
    delayInDays:
      dataToCalculateDeadlineQuery?.data?.requestTypeServiceCategory
        ?.minimumRequiredDelay,
  });

  const createMutation = useMutation({
    mutationFn: (data: TrackingOrderFormData) => {
      return Promise.resolve(data);
    },
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRACKING_ORDERS });
      toast.success(SUCCESS_MESSAGES.create("Commande"));
      reset(DEFAULT_VALUES);
      navigate({ to: "/applications/tracking-order", search: { page: 1 } });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  // Handlers pour les selects en cascade
  const handleSectorChange = useCallback(
    (value: string) => {
      setValue("sectorId", value);
      setValue("serviceId", "");
      setValue("serviceCategoryId", "");
      setValue("requestTypeServiceCategoryId", "");
      setValue("requestTypeDelayId", "");
    },
    [setValue]
  );

  const handleServiceChange = useCallback(
    (value: string) => {
      setValue("serviceId", value);
      setValue("serviceCategoryId", "");
      setValue("requestTypeServiceCategoryId", "");
      setValue("requestTypeDelayId", "");
    },
    [setValue]
  );

  const handleServiceCategoryChange = useCallback(
    (value: string) => {
      setValue("serviceCategoryId", value);
      setValue("requestTypeServiceCategoryId", "");
      setValue("requestTypeDelayId", "");
    },
    [setValue]
  );

  const handleRequestTypeServiceCategoryChange = useCallback(
    (value: string) => {
      setValue("requestTypeServiceCategoryId", value);
      setValue("requestTypeDelayId", "");
    },
    [setValue]
  );

  const handleRequestTypeDelayChange = useCallback(
    (value: string) => {
      setValue("requestTypeDelayId", value);
    },
    [setValue]
  );

  const handleCancel = useCallback(() => {
    navigate({ to: "/applications/tracking-order", search: { page: 1 } });
  }, [navigate]);

  const onSubmit = useCallback(
    (data: TrackingOrderFormData) => {
      createMutation.mutate(data);
    },
    [createMutation]
  );

  return {
    form,
    backendError,
    watchers: {
      clientId,
      sectorId,
      serviceId,
      serviceCategoryId,
      requestTypeServiceCategoryId,
      requestTypeDelayId,
      order_registration_at,
      order_registration_time,
    },
    handlers: {
      onSubmit,
      handleCancel,
      handleSectorChange,
      handleServiceChange,
      handleServiceCategoryChange,
      handleRequestTypeServiceCategoryChange,
      handleRequestTypeDelayChange,
    },
    mutation: createMutation,
    processingDeadlineQuery,
    dataToCalculateDeadlineQuery,
  };
}
