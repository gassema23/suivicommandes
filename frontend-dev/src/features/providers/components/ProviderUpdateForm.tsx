import { Button } from "@/components/ui/quebec/Button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import FormError from "@/components/ui/shadcn/form-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Provider } from "../types/provider.type";
import { providerSchema, type ProviderFormData } from "../schemas/provider.schema";
import { updateProvider } from "../services/update-provider.service";
import { QUERY_KEYS } from "@/config/query-key";

interface ProviderFormProps {
  provider: Provider;
}

export default function ProviderUpdateForm({ provider }: ProviderFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      providerName: provider?.providerName ?? "",
      providerCode: provider?.providerCode ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateProviderMutation = useMutation({
    mutationFn: (data: ProviderFormData) => updateProvider(provider.id, data),
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
    updateProviderMutation.mutate(data);
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
        <Label className="col-span-12 xl:col-span-4" htmlFor="providerName">
          Fournisseur
        </Label>
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
        <Label className="col-span-12 xl:col-span-4" htmlFor="providerCode">
          Identifiant du fournisseur
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="providerCode"
            {...register("providerCode")}
            required
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
          {form.formState.isSubmitting ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
}
