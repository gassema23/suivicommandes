import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "@/features/auth/login-form";
import { APP_NAME } from "@/config";
import { z } from "zod";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/_guest/(login)/_guestLayout/login")({
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
        title: `Connexion | ${APP_NAME}`,
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
  return <LoginForm />;
}
