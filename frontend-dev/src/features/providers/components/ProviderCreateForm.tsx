import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/shadcn/button";
import FormError from "@/components/ui/shadcn/form-error";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { providerSchema, type ProviderFormData } from "../schemas/provider.schema";
import { createProvider } from "../services/create-provider.service";
import { QUERY_KEYS } from "@/config/query-key";

export default function ProviderCreateForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      providerName: "",
      providerCode: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const createFournisseurMutation = useMutation({
    mutationFn: (data: ProviderFormData) => createProvider(data),
    onSuccess: () => {
      setBackendError(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDERS });
      navigate({ to: "/pilotages/providers" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });
  const onSubmit = (data: ProviderFormData) => {
    createFournisseurMutation.mutate(data);
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
        <Label className="col-span-12 xl:col-span-4" htmlFor="providerName">Fournisseur</Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="providerName"
            {...register("providerName")}
            required
          />
          {errors.providerName && (
            <p className="text-destructive text-sm mt-1">
              {errors.providerName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="providerCode">Identifiant du fournisseur</Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="providerCode"
            {...register("providerCode")}
          />
          {errors.providerCode && (
            <p className="text-destructive text-sm mt-1">
              {errors.providerCode.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/pilotages/providers" })}
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
