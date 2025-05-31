import LoadingPage from "@/components/ui/loader/loading-page";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/quebec/Alert";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import VerifyEmailForm from "@/features/auth/verify-email-form";
import type { User } from "@/features/users/types/user.type";
import { fetchEmailToken } from "@/features/verify-email/services/fetchEmailToken";
import { verifyEmailParamsSchema } from "@/features/verify-email/shemas/verify-email.schema";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Info } from "lucide-react";

export const Route = createFileRoute("/_guest/verify-email/$token")({
  validateParams: verifyEmailParamsSchema,

  beforeLoad: async ({ params }) => {
    console.log("Loading verify-email route", params.token);
  },

  loader: async ({ params }) => {
    return fetchEmailToken(params.token) || {};
  },

  head: () => ({
    meta: [
      { title: `Vérification de l'adresse courriel | ${APP_NAME}` },
      { name: "description", content: "Vérification de votre adresse email" },
    ],
  }),
  errorComponent: ({ error }) => (
    <FormError title="Erreur" message={error.message} />
  ),
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  const data = useLoaderData({ from: "/_guest/verify-email/$token" }) as {
    message?: string;
    user?: User;
  };
  console.log("Data from verify-email route:", data);
  return (
    <div className="xl:max-w-3xl w-full space-y-4">
      <Alert variant="info">
        <Info className="alert-icon h-4 w-4" />
        <AlertTitle>Succès</AlertTitle>
        <AlertDescription>
          {data.message || "Votre adresse courriel a été vérifiée avec succès."}
        </AlertDescription>
      </Alert>
      <VerifyEmailForm user={data.user} />
    </div>
  );
}
