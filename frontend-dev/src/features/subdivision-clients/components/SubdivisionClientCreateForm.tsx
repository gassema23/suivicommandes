import { Button } from "@/components/ui/quebec/Button";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { subdivisionClientSchema, type SubdivisionClientFormData } from "../schemas/subdivision-client.schema";
import { fetchClients } from "../services/fetch-client.service";
import { createSubdivisionClient } from "../services/create-subdivision-client.service";

export default function SubdivisionClientCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: clientData = [],
    isLoading: loadingClients,
    error: clientError,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  const form = useForm<SubdivisionClientFormData>({
    resolver: zodResolver(subdivisionClientSchema),
    defaultValues: {
      subdivisionClientName: "",
      subdivisionClientNumber: "",
      clientId: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const createTeamMutation = useMutation({
    mutationFn: (data: SubdivisionClientFormData) => createSubdivisionClient(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: ["createSubdivisions"] });
      navigate({ to: "/pilotages/subdivision-clients" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: SubdivisionClientFormData) => {
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
        <Label className="col-span-12 xl:col-span-4" htmlFor="clientId">
          Clients
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Controller
            control={control}
            name="clientId"
            render={({ field }) =>
              loadingClients ? (
                <Skeleton className="h-9" />
              ) : clientError ? (
                <div className="bg-muted/50 border h-9 flex w-full px-3 items-center text-destructive/80">
                  Erreur de chargement
                </div>
              ) : (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une option" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientData.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.virtualClientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }
          />
          {errors.clientId && (
            <p className="text-destructive text-sm mt-1">
              {errors.clientId.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="subdivisionClientName">
          Subdivision client
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="subdivisionClientName"
            {...register("subdivisionClientName")}
            required
          />
          {errors.subdivisionClientName && (
            <p className="text-destructive text-sm mt-1">
              {errors.subdivisionClientName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label
          className="col-span-12 xl:col-span-4"
          htmlFor="subdivisionClientNumber"
        >
          Identifiant de la subdivision client
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="subdivisionClientNumber"
            {...register("subdivisionClientNumber")}
          />
          {errors.subdivisionClientNumber && (
            <p className="text-destructive text-sm mt-1">
              {errors.subdivisionClientNumber.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/subdivision-clients" })}
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
