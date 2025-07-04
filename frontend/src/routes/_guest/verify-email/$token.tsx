import LoadingPage from "@/components/ui/loader/LoadingPage";
import { APP_NAME } from "@/constants/app-name.constant";
import type { User } from "@/features/users/types/user.type";
import ResendVerificationEmailForm from "@/features/verify-email/components/ResendVerificationEmailForm";
import VerifyEmailExpiredErrorForm from "@/features/verify-email/components/ResendVerificationEmailForm";
import { fetchEmailToken } from "@/features/verify-email/services/fetch-email-token.service";
import { verifyEmailParamsSchema } from "@/features/verify-email/shemas/verify-email-params.schema";
import {
  createFileRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";

const fallback = "/" as const;

export const Route = createFileRoute("/_guest/verify-email/$token")({
  validateParams: verifyEmailParamsSchema,

  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
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
  errorComponent: () => {
    return <VerifyEmailExpiredErrorForm />;
  },
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  const data = useLoaderData({ from: "/_guest/verify-email/$token" }) as {
    message?: string;
    user?: User;
  };
  return <ResendVerificationEmailForm user={data.user} />;
}
