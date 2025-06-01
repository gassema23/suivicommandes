"use client";
import { Button } from "@/components/ui/quebec/Button";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import FormError from "@/components/ui/shadcn/form-error";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import ErrorMessage from "@/components/ui/shadcn/error-message";
import PasswordInput from "@/components/ui/shadcn/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { updateVerifyEmail } from "../services/updateVerifyEmail";
import type { User } from "@/features/users/types/user.type";
import { VerifyEmailSchema, type VerifyEmailFormData } from "../shemas/verify-email.schema";
type VerifyEmailFormProps = {
  user: User;
};

export default function VerifyEmailForm({ user }: VerifyEmailFormProps) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: user.email,
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const verifyEmailMutation = useMutation({
    mutationFn: (data: VerifyEmailFormData) => updateVerifyEmail(user.id, data),
    onSuccess: () => {
      setBackendError(null);
      navigate({ to: "/" });
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: VerifyEmailFormData) => {
    setBackendError(null);
    // Appelle ta mutation ici
    verifyEmailMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="xl:max-w-3xl w-full space-y-4"
    >
      <div className="flex flex-col">
        <h1 className="section-title">Bienvenu {user.fullName}</h1>
        <p className="subtitle">
          Entrez votre adresse courriel ci-dessous pour vous connecter à votre
          compte
        </p>
        {backendError && (
          <FormError
            title="Erreur de vérification de l'adresse courriel"
            message={backendError}
          />
        )}
      </div>
      <div className="grid gap-6 w-full">
        <div className="grid gap-2">
          <Label htmlFor="email">Courriel</Label>
          <Input
            id="email"
            className="disabled:bg-muted"
            type="email"
            disabled
            readOnly
            {...register("email")}
          />
          <ErrorMessage message={errors?.email?.message || ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordInput
            id="password"
            placeholder="Mot de passe"
            {...register("password")}
            autoComplete="current-password"
          />
          <ErrorMessage message={errors?.password?.message || ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirmer votre mot de passe</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirmer votre mot de passe"
            {...register("confirmPassword")}
          />
          <ErrorMessage message={errors?.confirmPassword?.message || ""} />
        </div>
        <Button type="submit" className="w-full">
          Vérifier mon courriel
        </Button>
      </div>
    </form>
  );
}
