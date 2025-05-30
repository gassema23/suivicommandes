"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/quebec/Button";
import { QuebecLink } from "@/components/ui/quebec/QuebecLink";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LoginSchema } from "./schema/login.schema";
import { API_ROUTE } from "@/config";
import FormError from "@/components/ui/shadcn/form-error";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import ErrorMessage from "@/components/ui/shadcn/error-message";
import PasswordInput from "@/components/ui/shadcn/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [backendError, setBackendError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
  });
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${API_ROUTE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Une erreur est survenue lors de la connexion."
        );
      }
      return data;
    },
    onError: (error: { message: string }) => {
      setBackendError(error.message);
    },
    onSuccess: async () => {
      setBackendError(null);
      await login(); // <-- met à jour le contexte utilisateur
      navigate({ to: "/" });
    },
  });

  const onSubmit = async (data: FormData) => {
    setBackendError(null);
    mutation.mutate(data);
  };

  return (
    <form
      className={cn("flex flex-col gap-6 w-full", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <h1 className="section-title">Connexion</h1>
        <p className="subtitle">
          Entrez votre adresse courriel ci-dessous pour vous connecter à votre
          compte
        </p>
        {backendError && (
          <FormError
            title="Erreur lors de la connexion"
            message={backendError}
          />
        )}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Courriel</Label>
          <Input
            id="email"
            type="email"
            placeholder="John.Doe@example.com"
            {...register("email")}
            autoComplete="email"
          />
          <ErrorMessage message={errors?.email?.message || ""} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <QuebecLink href="/forgot-password" className="text-sm">
              Mot de passe oublié?
            </QuebecLink>
          </div>
          <PasswordInput
            id="password"
            placeholder="Mot de passe"
            {...register("password")}
            autoComplete="current-password"
          />
          <ErrorMessage message={errors?.password?.message || ""} />
        </div>
        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </div>
      <div className="text-center text-sm">
        Vous n&apos;avez pas de compte?{" "}
        <QuebecLink href="/register">S&apos;inscrire</QuebecLink>
      </div>
    </form>
  );
}
