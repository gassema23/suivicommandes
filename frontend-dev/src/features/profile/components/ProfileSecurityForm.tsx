import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  passwordSchema,
  type PasswordFormData,
} from "../schemas/password.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { updatePassword } from "../services/update-password.service";
import FormError from "@/components/ui/shadcn/form-error";
import { Label } from "@/components/ui/shadcn/label";
import PasswordInput from "@/components/ui/shadcn/password-input";
import { Button } from "@/components/ui/quebec/Button";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/features/common/constants/messages.constant";

export default function ProfileSecurityForm({ userId }: { userId: string }) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const updateMutation = useMutation({
    mutationFn: (data: PasswordFormData) => updatePassword(userId, data),
    onSuccess: async () => {
      setBackendError(null);
      reset();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
      ]);
      toast.success(SUCCESS_MESSAGES.update("Mot de passe"));
      navigate({ to: "/profile" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    updateMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="title-md">Sécurité</h3>
      <p className="subtitle">
        Gérez vos paramètres de sécurité et mot de passe.
      </p>
      {backendError && (
        <FormError
          title="Erreur lors de l'envoie du formulaire"
          message={backendError}
        />
      )}
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="currentPassword">
          Mot de passe actuel
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <PasswordInput
            className="block w-full"
            id="currentPassword"
            {...register("currentPassword")}
            required
          />
          {errors.currentPassword && (
            <p className="text-destructive text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="newPassword">
          Nouveau mot de passe
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <PasswordInput
            className="block w-full"
            id="newPassword"
            {...register("newPassword")}
            required
          />
          {errors.newPassword && (
            <p className="text-destructive text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="confirmPassword">
          Confirmer le mot de passe
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <PasswordInput
            className="block w-full"
            id="confirmPassword"
            {...register("confirmPassword")}
            required
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
      {/* Actions du formulaire */}
      <div className="flex gap-4 justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
}
