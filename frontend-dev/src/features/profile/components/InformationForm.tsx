import { Input } from "@/components/ui/shadcn/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/quebec/Button";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import {
  userInformationSchema,
  type UserInformationFormData,
} from "../schemas/user-information.schema";
import { updateUserInformation } from "../services/update-user-information.service";
import type { User } from "@/features/users/types/user.type";
import { Label } from "@/components/ui/shadcn/label";
import { QUERY_KEYS } from "@/config/query-key";

interface InformationFormProps {
  user: User;
}

export default function InformationForm({ user }: InformationFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const form = useForm<UserInformationFormData>({
    resolver: zodResolver(userInformationSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const updateUserMutation = useMutation({
    mutationFn: (data: UserInformationFormData) =>
      updateUserInformation(user.id, data),
    onSuccess: async () => {
      setBackendError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS }),
      ]);

      setSuccessMessage("Vos informations ont été mises à jour avec succès.");
      navigate({ to: "/profile" });
    },
    onError: (error: { message: string }) => {
      setSuccessMessage(null);
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: UserInformationFormData) => {
    updateUserMutation.mutate(data);
  };
  return (
    <form
      className="xl:w-3xl w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="title-md">Informations personnelles</h2>
      <p className="subtitle">
        Mettez à jour vos informations personnelles ici.
      </p>
      {backendError && (
        <FormError
          title="Erreur lors de l'envoie du formulaire"
          message={backendError}
        />
      )}
      {successMessage && (
        <FormError
          variant="success"
          title="Opération réussie"
          message={successMessage}
        />
      )}
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="firstName">
          Prénom
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="firstName"
            {...register("firstName")}
            required
          />
          {errors.firstName && (
            <p className="text-destructive text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="lastName">
          Nom
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="lastName"
            {...register("lastName")}
            required
          />
          {errors.lastName && (
            <p className="text-destructive text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 items-center">
        <Label className="col-span-12 xl:col-span-4" htmlFor="email">
          Email
        </Label>
        <div className="col-span-12 xl:col-span-8">
          <Input
            className="block w-full"
            id="email"
            type="email"
            {...register("email")}
            required
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">
              {errors.email.message}
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
