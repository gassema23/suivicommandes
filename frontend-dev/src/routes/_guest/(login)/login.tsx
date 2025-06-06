import { createFileRoute, redirect } from "@tanstack/react-router";
import { APP_NAME } from "@/config";
import { z } from "zod";
import MultiStepLoginForm from "@/features/common/auth/components/MultiStepLoginForm";

const fallback = "/" as const;

export const Route = createFileRoute("/_guest/(login)/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "Connectez-vous à votre compte pour accéder à toutes les fonctionnalités.",
      },
      {
        title: `Connexion`,
      },
    ],
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return <MultiStepLoginForm />;
}
