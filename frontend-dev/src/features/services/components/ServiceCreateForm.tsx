import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/shadcn/label";
import { useForm } from "react-hook-form";
import { serviceSchema, type ServiceFormData } from "../schemas/service.schema";
import { createService } from "../services/create-service.service";
import { fetchSectorsList } from "@/features/sectors/services/fetch-sectors-list.service";
import { DependentSelect } from "@/features/common/dependant-select/components/DependentSelect";
import { QUERY_KEYS } from "@/config/query-key";

export default function ServiceCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: sectors = [],
    isLoading: isLoadingSectors,
    isError: isErrorSectors,
  } = useQuery({
    queryKey: QUERY_KEYS.SECTORS_LISTS,
    queryFn: fetchSectorsList,
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      serviceDescription: "",
      sectorId: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;
  
  const sectorId = watch("sectorId");

  const createTeamMutation = useMutation({
    mutationFn: (data: ServiceFormData) => createService(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
      navigate({ to: "/pilotages/services" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: ServiceFormData) => {
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
          <DependentSelect
            value={watch("sectorId")}
            onChange={(value) => {
              setValue("sectorId", value);
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
        <Label className="col-span-12 xl:col-span-4" htmlFor="serviceName">
          Service
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="sectorName"
            {...register("serviceName")}
            required
          />
          {errors.serviceName && (
            <p className="text-destructive text-sm mt-1">
              {errors.serviceName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="serviceDescription"
        >
          Description
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Textarea
            rows={3}
            className="block w-full"
            id="serviceDescription"
            {...register("serviceDescription")}
          />
          {errors.serviceDescription && (
            <p className="text-destructive text-sm mt-1">
              {errors.serviceDescription.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/services" })}
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
