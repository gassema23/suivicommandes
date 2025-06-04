import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/shadcn/label";
import { Controller, useForm } from "react-hook-form";
import {
  serviceCategorySchema,
  type ServiceCategoryFormData,
} from "../schemas/service-category.schema";
import { fetchSectorsList } from "@/features/sectors/services/fetch-sectors-list.service";
import { createServiceCategory } from "../services/create-service-category.service";
import { Switch } from "@/components/ui/shadcn/switch";
import { DependentSelect } from "@/features/common/dependant-select/components/DependentSelect";
import { useDependentQuery } from "@/features/common/dependant-select/hooks/useDependentQuery";
import { fetchServicesBySector } from "@/features/services/services/fetch-services-by-sector.service";
import { QUERY_KEYS } from "@/config/query-key";

export default function ServiceCategoryCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const sectorId = watch("sectorId");

  const {
    data: sectors,
    isLoading: isLoadingSectors,
    isError: isErrorSectors,
  } = useQuery({
    queryKey: ["sectorsLists"],
    queryFn: fetchSectorsList,
  });

  const {
    data: services,
    isLoading: isLoadingServices,
    isError: isErrorServices,
  } = useDependentQuery(["servicesLists"], fetchServicesBySector, sectorId);

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
        <Label className="col-span-12 xl:col-span-4" htmlFor="sectorId">
          Secteur
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <DependentSelect
            value={watch("sectorId")}
            onChange={(value) => {
              setValue("sectorId", value);
              setValue("serviceId", "");
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
        <Label className="col-span-12 xl:col-span-4" htmlFor="serviceId">
          Services
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <DependentSelect
            value={watch("serviceId")}
            onChange={(value) => setValue("serviceId", value)}
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
