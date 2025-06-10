import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import LoginContainer from "@/features/common/auth/components/LoginContainer";

const fallback = "/" as const;

export const Route = createFileRoute("/_guest/(login)/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  head: () => ({
    meta: [{ title: `Connexion` }],
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginPage,
});

function LoginPage() {

  return <LoginContainer />;
}
