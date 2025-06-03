import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectorSchema, type SectorFormData } from "../schemas/sector.schema";
import { Label } from "@/components/ui/shadcn/label";
import { Controller, useForm } from "react-hook-form";
import { Switch } from "@/components/ui/shadcn/switch";
import { createSector } from "../services/create-sector.service";

export default function SectorCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<SectorFormData>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      sectorName: "",
      sectorDescription: "",
      sectorClientTimeEnd: "",
      sectorProviderTimeEnd: "",
      isAutoCalculate: false,
      isConformity: false,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const createTeamMutation = useMutation({
    mutationFn: (data: SectorFormData) => createSector(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: ["sectors"] });
      navigate({ to: "/pilotages/sectors" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: SectorFormData) => {
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
        <Label className="col-span-12 xl:col-span-4" htmlFor="sectorName">
          Secteur
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="sectorName"
            {...register("sectorName")}
            required
          />
          {errors.sectorName && (
            <p className="text-destructive text-sm mt-1">
              {errors.sectorName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="sectorClientTimeEnd"
        >
          Heure de tombée client
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            type="time"
            className="block w-full"
            id="sectorClientTimeEnd"
            {...register("sectorClientTimeEnd")}
          />
          {errors.sectorClientTimeEnd && (
            <p className="text-destructive text-sm mt-1">
              {errors.sectorClientTimeEnd.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="sectorProviderTimeEnd"
        >
          Heure de tombée fournisseur
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            type="time"
            className="block w-full"
            id="sectorProviderTimeEnd"
            {...register("sectorProviderTimeEnd")}
          />
          {errors.sectorProviderTimeEnd && (
            <p className="text-destructive text-sm mt-1">
              {errors.sectorProviderTimeEnd.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="isAutoCalculate">
          Calcul automatique
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="isAutoCalculate"
            render={({ field }) => (
              <Switch
                id="isAutoCalculate"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          {errors.isAutoCalculate && (
            <p className="text-destructive text-sm mt-1">
              {errors.isAutoCalculate.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="isConformity">
          Conformité obligatoire
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="isConformity"
            render={({ field }) => (
              <Switch
                id="isConformity"
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          {errors.isConformity && (
            <p className="text-destructive text-sm mt-1">
              {errors.isConformity.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="sectorDescription"
        >
          Description
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Textarea
            rows={3}
            className="block w-full"
            id="sectorDescription"
            {...register("sectorDescription")}
          />
          {errors.sectorDescription && (
            <p className="text-destructive text-sm mt-1">
              {errors.sectorDescription.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/sectors" })}
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
