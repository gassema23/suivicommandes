import { QUERY_KEYS } from "@/constants/query-key.constant";

import { fetchSectorsList } from "@/shared/sectors/services/fetch-sectors-list.service";
import { fetchServicesBySector } from "@/shared/services/services/fetch-services-by-sector.service";
import { fetchProvidersList } from "@/shared/providers/services/fetch-providers-list.service";
import { fetchServiceCategoriesByService } from "@/shared/service-categories/services/fetch-service-category-by-service.service";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  providerServiceCategorySchema,
  type ProviderServiceCategoryFormData,
} from "../schemas/provider-service-category.schema";
import FormError from "@/components/ui/shadcn/form-error";
import { DependentSelect } from "@/components/dependant-select/components/DependentSelect";
import { useDependentQuery } from "@/components/dependant-select/hooks/useDependentQuery";
import { FormActions } from "@/components/forms/components/FormActions";
import InputContainer from "@/components/forms/components/InputContainer";
import type { ProviderServiceCategory } from "../types/provider-service-category.type";
import { toast } from "sonner";
import { providerServiceCategoryFields } from "../configs/provider-service-category-fields";
import { updateProviderServiceCategory } from "../services/update-provider-service-category.service";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { formatErrorMessage } from "@/lib/utils";

interface ProviderServiceCategoryUpdateFormProps {
  providerServiceCategory: ProviderServiceCategory;
}

export default function ProviderServiceCategoryUpdateForm({
  providerServiceCategory,
}: ProviderServiceCategoryUpdateFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderServiceCategoryFormData>({
    resolver: zodResolver(providerServiceCategorySchema),
    defaultValues: {
      providerId: providerServiceCategory.provider.id ?? "",
      sectorId: providerServiceCategory.serviceCategory.service.sector.id ?? "",
      serviceId: providerServiceCategory.serviceCategory.service.id ?? "",
      serviceCategoryId: providerServiceCategory.serviceCategory.id ?? "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: ProviderServiceCategoryFormData) =>
      updateProviderServiceCategory(providerServiceCategory.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROVIDER_SERVICE_CATEGORIES,
      });
      toast.success(SUCCESS_MESSAGES.update("Association"));
      navigate({
        to: "/pilotages/provider-service-categories",
        search: { page: 1 },
      });
    },
    onError: (error: { message: string }) => {
      setBackendError(formatErrorMessage(error));
    },
  });

  const sectorId = watch("sectorId");
  const serviceId = watch("serviceId");

  const {
    data: sectors,
    isLoading: isLoadingSectors,
    isError: isErrorSectors,
  } = useQuery({
    queryKey: QUERY_KEYS.SECTORS_LISTS,
    queryFn: fetchSectorsList,
  });

  const {
    data: providers,
    isLoading: isLoadingProviders,
    isError: isErrorProviders,
  } = useQuery({
    queryKey: QUERY_KEYS.PROVIDERS_LISTS,
    queryFn: fetchProvidersList,
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

  const onSubmit = (data: ProviderServiceCategoryFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {backendError && <FormError message={backendError} />}

      {providerServiceCategoryFields.map((field) => (
        <InputContainer
          key={field.name}
          label={field.label}
          error={errors[field.name]?.message}
          htmlFor={field.name}
          required={field.required}
        >
          {field.component === "select-sector" && (
            <DependentSelect
              value={watch("sectorId")}
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
              value={watch("serviceId")}
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
          {field.component === "select-provider" && (
            <DependentSelect
              value={watch("providerId")}
              onChange={(value) => setValue("providerId", value)}
              data={providers}
              isLoading={isLoadingProviders}
              isError={isErrorProviders}
              placeholder={field.placeholder}
              getOptionValue={(s) => s.id}
              getOptionLabel={(s) => s.virtualProviderName}
            />
          )}
        </InputContainer>
      ))}

      <FormActions
        isLoading={updateMutation.isPending}
        onCancel={() =>
          navigate({
            to: "/pilotages/provider-service-categories",
            search: { page: 1 },
          })
        }
      />
    </form>
  );
}
