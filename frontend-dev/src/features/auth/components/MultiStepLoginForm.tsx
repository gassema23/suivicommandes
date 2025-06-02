import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/quebec/Button";
import { Input } from "@/components/ui/shadcn/input";
import PasswordInput from "@/components/ui/shadcn/password-input";
import FormError from "@/components/ui/shadcn/form-error";
import ErrorMessage from "@/components/ui/shadcn/error-message";
import { useAuth } from "@/providers/auth-provider";
import { API_ROUTE } from "@/config";
import { QuebecLink } from "@/components/ui/quebec/QuebecLink";
import { Label } from "@/components/ui/shadcn/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/shadcn/input-otp";

// Schémas Zod
const Step1Schema = z.object({
  email: z.string().email("Adresse courriel invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
const Step2Schema = z.object({
  code: z.string().length(6, "Le code doit contenir exactement 6 chiffres"),
});

export default function MultiStepLoginForm({
  className,
}: {
  className?: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const search = useSearch({ from: "/_guest/(login)/login" });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Step 1: Email + mot de passe
  const formStep1 = useForm<z.infer<typeof Step1Schema>>({
    resolver: zodResolver(Step1Schema),
  });

  // Step 2: Code 2FA
  const formStep2 = useForm<z.infer<typeof Step2Schema>>({
    resolver: zodResolver(Step2Schema),
  });

  // Mutation pour vérifier email/mot de passe
  const checkMutation = useMutation({
    mutationFn: async (data: z.infer<typeof Step1Schema>) => {
      const res = await fetch(`${API_ROUTE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Erreur de connexion.");
      return result;
    },
    onSuccess: (data, variables) => {
      setEmail(variables.email);
      if (data.twoFactorEnabled) {
        setStep(2);
      } else {
        // Connexion directe si pas de 2FA
        login(search.redirect);
      }
    },
    onError: (error: any) => setBackendError(error.message),
  });

  // Mutation pour vérifier le code 2FA
  const verifyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof Step2Schema>) => {
      const res = await fetch(`${API_ROUTE}/auth/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: data.code }),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Code 2FA invalide.");
      return result;
    },
    onSuccess: () => {
      login(search.redirect);
    },
    onError: (error: any) => setBackendError(error.message),
  });

  // Soumission étape 1
  const onSubmitStep1 = (data: z.infer<typeof Step1Schema>) => {
    setBackendError(null);
    checkMutation.mutate(data);
  };

  // Soumission étape 2
  const onSubmitStep2 = (data: z.infer<typeof Step2Schema>) => {
    setBackendError(null);
    verifyMutation.mutate(data);
  };

  return (
    <div className={className}>
      {step === 1 && (
        <form
          onSubmit={formStep1.handleSubmit(onSubmitStep1)}
          className="flex flex-col gap-6 w-full"
        >
          <h1 className="section-title">Connexion</h1>
          <p className="subtitle">
            Entrez votre adresse courriel ci-dessous pour vous connecter à votre
            compte
          </p>
          {backendError && <FormError title="Erreur" message={backendError} />}
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Adresse courriel</Label>
              <Input
                id="email"
                type="email"
                placeholder="John.Doe@example.com"
                {...formStep1.register("email")}
                autoComplete="email"
              />
              <ErrorMessage
                message={formStep1.formState.errors?.email?.message || ""}
              />
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
                {...formStep1.register("password")}
                autoComplete="current-password"
              />
              <ErrorMessage
                message={formStep1.formState.errors?.password?.message || ""}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={checkMutation.isPending}
            >
              Se connecter
            </Button>
          </div>
        </form>
      )}
      {step === 2 && (
        <form
          onSubmit={formStep2.handleSubmit(onSubmitStep2)}
          className="flex flex-col gap-6 w-full"
        >
        
          <h1 className="section-title">Vérification en deux étapes</h1>
          <p className="subtitle">
            Veuillez entrer le code généré par votre application
            d’authentification.
          </p>
          {backendError && <FormError title="Erreur" message={backendError} />}
          <div className="grid gap-6">
            <InputOTP
              maxLength={6}
              {...formStep2.register("code")}
              className="w-full"
            >
              <InputOTPGroup className="flex justify-center items-center space-x-3">
                <InputOTPSlot index={0} className="border" />
                <InputOTPSlot index={1} className="border" />
                <InputOTPSlot index={2} className="border" />
                <InputOTPSlot index={3} className="border" />
                <InputOTPSlot index={4} className="border" />
                <InputOTPSlot index={5} className="border" />
              </InputOTPGroup>
            </InputOTP>
            <ErrorMessage
              message={formStep2.formState.errors?.code?.message || ""}
            />
            <Button
              type="submit"
              className="w-full"
              loading={verifyMutation.isPending}
            >
              Vérifier
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
