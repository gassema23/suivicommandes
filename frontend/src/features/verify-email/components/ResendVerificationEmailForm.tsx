import { Button } from "@/components/ui/quebec/Button";
import ErrorMessage from "@/components/ui/shadcn/error-message";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { resendEmailVerification } from "../services/resend-email-verification.service";
import {
  resendVerificationEmailSchema,
  type ResendVerificationEmail,
} from "../shemas/resend-verification-email.schema";

export default function ResendVerificationEmailForm() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const params = useParams({ from: "/_guest/verify-email/$token" });
  const token = params.token;

  const navigate = useNavigate();

  const form = useForm<ResendVerificationEmail>({
    resolver: zodResolver(resendVerificationEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const verifyEmailMutation = useMutation({
    mutationFn: (data: ResendVerificationEmail) =>
      resendEmailVerification({ ...data, token }),
    onSuccess: () => {
      setBackendError(null);
      reset();
      setSuccessMessage(
        "Un nouveau lien de vérification a été envoyé à votre adresse courriel."
      );
      //navigate({ to: "/" });
    },
    onError: (error: { message: string }) => {
      setSuccessMessage(null);
      setBackendError(error.message);
    },
  });

  const onSubmit = (data: ResendVerificationEmail) => {
    setBackendError(null);
    // Appelle ta mutation ici
    verifyEmailMutation.mutate(data);
  };

  if (successMessage) {
    return (
      <div className="xl:max-w-3xl w-full space-y-4">
        <div className="flex flex-col">
          <h1 className="section-title">Succès</h1>
          <p className="subtitle">{successMessage}</p>
          <Button onClick={() => navigate({ to: "/" })} className="w-full">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="xl:max-w-3xl w-full space-y-4"
    >
      {backendError && (
        <ErrorMessage
          title="Erreur lors de la vérification de l'adresse courriel"
          message={backendError}
        />
      )}
      <div className="flex flex-col">
        <h1 className="section-title">Besoin d’un nouveau départ ?</h1>
        <p className="subtitle">
          Votre session a expiré. Pas d’inquiétude, entrez simplement votre
          adresse courriel pour continuer.
        </p>
        <div className="grid gap-6 w-full">
          <div className="grid gap-2">
            <Label htmlFor="email">Courriel</Label>
            <Input
              id="email"
              className="disabled:bg-muted"
              type="email"
              {...register("email")}
            />
            <ErrorMessage message={errors?.email?.message || ""} />
          </div>
          <Button type="submit" className="w-full">
            Vérifier mon courriel
          </Button>
        </div>
      </div>
    </form>
  );
}
