import { QUERY_KEYS } from "@/config/query-key";
import { fetchSectorsList } from "@/features/sectors/services/fetch-sectors-list.service";
import { fetchServicesBySector } from "@/features/services/services/fetch-services-by-sector.service";
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
import { Label } from "@/components/ui/shadcn/label";
import { Button } from "@/components/ui/quebec/Button";
import { DependentSelect } from "@/features/common/dependant-select/components/DependentSelect";
import { useDependentQuery } from "@/features/common/dependant-select/hooks/useDependentQuery";
import { fetchServiceCategoriesByService } from "@/features/service-categories/services/fetch-service-category-by-service.service";
import { fetchProvidersList } from "@/features/providers/services/fetch-providers-list.service";
import { createProviderServiceCategory } from "../services/create-provider-service-category.service";

export default function ProviderServiceCategoryCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderServiceCategoryFormData>({
    resolver: zodResolver(providerServiceCategorySchema),
    defaultValues: {
      providerId: "",
      sectorId: "",
      serviceId: "",
      serviceCategoryId: "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const createTeamMutation = useMutation({
    mutationFn: (data: ProviderServiceCategoryFormData) =>
      createProviderServiceCategory(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROVIDER_SERVICE_CATEGORIES,
      });
      navigate({ to: "/pilotages/provider-service-categories" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: ProviderServiceCategoryFormData) => {
    createTeamMutation.mutate(data);
  };

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
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="ownerId">
          Secteurs
        </Label>
        <div className="col-span-12 xl:col-span-8">
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
            placeholder="Sélectionner un secteur"
            getOptionValue={(s) => s.id}
            getOptionLabel={(s) => s.sectorName}
          />
          {errors.sectorId && (
            <p className="text-destructive text-sm mt-1">
              {errors.sectorId.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4">Services</Label>
        <div className="col-span-12 xl:col-span-8">
          <DependentSelect
            value={watch("serviceId")}
            onChange={(value) => {
              setValue("serviceId", value);
              setValue("serviceCategoryId", "");
            }}
            data={services}
            isLoading={isLoadingServices}
            isError={isErrorServices}
            placeholder="Sélectionner un service"
            getOptionValue={(s) => s.id}
            getOptionLabel={(s) => s.serviceName}
          />
          {errors.serviceId && (
            <p className="text-destructive text-sm mt-1">
              {errors.serviceId.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4">
          Catégorie de services
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <DependentSelect
            value={watch("serviceCategoryId")}
            onChange={(value) => setValue("serviceCategoryId", value)}
            data={serviceCategories}
            isLoading={isLoadingServiceCategories}
            isError={isErrorServiceCategories}
            placeholder="Sélectionner une catégorie de service"
            getOptionValue={(s) => s.id}
            getOptionLabel={(s) => s.serviceCategoryName}
          />
          {errors.serviceCategoryId && (
            <p className="text-destructive text-sm mt-1">
              {errors.serviceCategoryId.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4">Fournisseurs</Label>
        <div className="col-span-12 xl:col-span-8">
          <DependentSelect
            value={watch("providerId")}
            onChange={(value) => setValue("providerId", value)}
            data={providers}
            isLoading={isLoadingProviders}
            isError={isErrorProviders}
            placeholder="Sélectionner un fournisseur"
            getOptionValue={(s) => s.id}
            getOptionLabel={(s) => s.virtualProviderName}
          />
          {errors.providerId && (
            <p className="text-destructive text-sm mt-1">
              {errors.providerId.message}
            </p>
          )}
        </div>
      </div>

      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/provider-service-categories" })}
          disabled={form.formState.isSubmitting}
        >
          Annuler
        </Button>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
