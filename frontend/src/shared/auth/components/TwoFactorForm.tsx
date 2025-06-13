"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/quebec/Button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import FormError from "@/components/ui/shadcn/form-error";
import { useAuth } from "@/providers/auth.provider";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { API_ROUTE } from "../../../constants/api-route.constant";

interface TwoFactorFormProps {
  sessionToken: string;
  userEmail: string;
  onBack: () => void;
  className?: string;
}

const twoFactorSchema = z.object({
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
});

type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

export default function TwoFactorForm({
  sessionToken,
  userEmail,
  onBack,
  className = "",
}: TwoFactorFormProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [backendError, setBackendError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login, refetchUser } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Mettre à jour le champ de formulaire avec le code complet
    form.setValue("code", newCode.join(""));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const extractErrorMessage = (err: unknown): string => {
    if (err instanceof Error) return err.message;
    if (typeof err === "object" && err !== null && "message" in err) {
      return String((err as { message?: unknown }).message);
    }
    return "Une erreur inconnue est survenue. Veuillez réessayer.";
  };

  const verifyTwoFactorMutation = useMutation({
    mutationFn: async (data: { sessionToken: string; totpCode: string }) => {
      const response = await fetch(`${API_ROUTE}/auth/verify-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur de vérification");
      }

      return response.json();
    },
    onSuccess: async () => {
      await refetchUser();
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      login();
    },
    onError: (error) => {
      setBackendError(extractErrorMessage(error));
      setCode(["", "", "", "", "", ""]);
      form.setValue("code", "");
      inputRefs.current[0]?.focus();
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_ROUTE}/auth/2fa/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors du renvoi du code");
      }

      return response.json();
    },
    onSuccess: () => {
      setTimeLeft(30);
    },
    onError: (error) => {
      setBackendError(extractErrorMessage(error));
    },
  });

  const onSubmit = (data: TwoFactorFormData) => {
    setBackendError(null);
    verifyTwoFactorMutation.mutate({
      sessionToken,
      totpCode: data.code,
    });
  };

  const handleResendCode = () => {
    if (timeLeft > 0) return;
    resendCodeMutation.mutate();
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="section-title">Authentification à deux facteurs</h1>
        </div>
      </div>

      <p className="subtitle mb-6">
        Entrez le code à 6 chiffres généré par votre application
        d'authentification pour <span className="font-medium">{userEmail}</span>
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        {backendError && <FormError title="Erreur" message={backendError} />}

        <div className="grid gap-4">
          <Label htmlFor="code">Code d'authentification</Label>
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold"
                autoComplete="off"
              />
            ))}
          </div>
          <input type="hidden" {...form.register("code")} />
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={verifyTwoFactorMutation.isPending}
        >
          Vérifier le code
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas reçu de code ?
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResendCode}
            disabled={timeLeft > 0 || resendCodeMutation.isPending}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {timeLeft > 0
              ? `Renvoyer dans ${timeLeft}s`
              : resendCodeMutation.isPending
                ? "Envoi en cours..."
                : "Renvoyer le code"}
          </Button>
        </div>
      </form>
    </div>
  );
}
