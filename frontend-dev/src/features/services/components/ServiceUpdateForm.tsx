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
import { serviceSchema, type ServiceFormData } from "../schemas/service.schema";
import { fetchSectors } from "../services/fetch-sectors.service";
import type { Service } from "../types/service.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { updateService } from "../services/update-service.service";

interface ServiceUpdateFormProps {
  service: Service;
}

export default function ServiceUpdateForm({ service }: ServiceUpdateFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: sectorData = [],
    isLoading: loadingSectors,
    error: sectorError,
  } = useQuery({
    queryKey: ["sectors"],
    queryFn: fetchSectors,
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: service.serviceName || "",
      serviceDescription: service.serviceDescription || "",
      sectorId: service.sectorId || "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const createTeamMutation = useMutation({
    mutationFn: (data: ServiceFormData) => updateService(service.id, data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: ["services"] });
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une option" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorData.map((sector) => (
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
