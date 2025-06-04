import { QUERY_KEYS } from "@/config/query-key";
import { fetchSectorsList } from "@/features/sectors/services/fetch-sectors-list.service";
import { fetchServicesBySector } from "@/features/services/services/fetch-services-by-sector.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ProviderServiceCategoryCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: sectorsData = [],
    isLoading: loadingSectors,
    error: sectorError,
  } = useQuery({
    queryKey: QUERY_KEYS.SECTORS_LISTS,
    queryFn: fetchSectorsList,
  });

  const {
    data: servicesData = [],
    isLoading: loadingServices,
    error: serviceError,
  } = useQuery({
    queryKey: QUERY_KEYS.SERVICE_BY_SECTOR(selectedSectorId),
    queryFn: () =>
      selectedSectorId
        ? fetchServicesBySector(selectedSectorId)
        : Promise.resolve([]),
    enabled: !!selectedSectorId,
  });

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
    formState: { errors },
  } = form;

  const createTeamMutation = useMutation({
    mutationFn: (data: ServiceCategoryFormData) => createServiceCategory(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICE_CATEGORIES });
      navigate({ to: "/pilotages/service-categories" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: ServiceCategoryFormData) => {
    createTeamMutation.mutate(data);
  };

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
          <Controller
            control={control}
            name="sectorId"
            render={({ field }) =>
              loadingSectors ? (
                <Skeleton className="h-9" />
              ) : sectorError ? (
                <div className="bg-muted/50 border h-9 flex w-full px-3 items-center text-destructive/80">
                  Erreur de chargement
                </div>
              ) : (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    setSelectedSectorId(value);
                    field.onChange(value);
                    form.setValue("serviceId", ""); // reset le service quand le secteur change
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorsData.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.sectorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }
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
          <Controller
            control={control}
            name="serviceId"
            render={({ field }) =>
              loadingServices ? (
                <Skeleton className="h-9" />
              ) : serviceError ? (
                <div className="bg-muted/50 border h-9 flex w-full px-3 items-center text-destructive/80">
                  Erreur de chargement
                </div>
              ) : (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedSectorId || servicesData.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicesData.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.serviceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }
          />
          {errors.serviceId && (
            <p className="text-destructive text-sm mt-1">
              {errors.serviceId.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="serviceCategoryName"
        >
          Catégorie du service
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="serviceCategoryName"
            {...register("serviceCategoryName")}
            required
          />
          {errors.serviceCategoryName && (
            <p className="text-destructive text-sm mt-1">
              {errors.serviceCategoryName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="isMultiLink">
          Multi-liens
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="isMultiLink"
            render={({ field }) => (
              <Switch
                id="isMultiLink"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          {errors.isMultiLink && (
            <p className="text-destructive text-sm mt-1">
              {errors.isMultiLink.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="isMultiProvider">
          Multi-fournisseurs
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="isMultiProvider"
            render={({ field }) => (
              <Switch
                id="isMultiProvider"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          {errors.isMultiProvider && (
            <p className="text-destructive text-sm mt-1">
              {errors.isMultiProvider.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="isRequiredExpertise"
        >
          Expertise requise
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="isRequiredExpertise"
            render={({ field }) => (
              <Switch
                id="isRequiredExpertise"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          {errors.isRequiredExpertise && (
            <p className="text-destructive text-sm mt-1">
              {errors.isRequiredExpertise.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="serviceCategoryDescription"
        >
          Description
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Textarea
            rows={3}
            className="block w-full"
            id="serviceCategoryDescription"
            {...register("serviceCategoryDescription")}
          />
          {errors.serviceCategoryDescription && (
            <p className="text-destructive text-sm mt-1">
              {errors.serviceCategoryDescription.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/service-categories" })}
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
