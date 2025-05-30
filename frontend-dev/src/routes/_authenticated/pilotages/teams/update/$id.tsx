import LoadingPage from "@/components/ui/loader/loading-page";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import TeamUpdateForm from "@/features/teams/components/team-update-form";
import { fetchTeam } from "@/features/teams/services/fetchTeam";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/teams/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.TEAMS.UPDATE]),
  loader: async ({ params }) => {
    return fetchTeam(params.id);
  },
  head: () => ({
    meta: [
      {
        name: "description",
        content: "",
      },
      {
        title: `Modifier l'équipe | ${APP_NAME}`,
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement de l'équipe"
      message={error.message}
    />
  ),
  staticData: {
    title: "Modifier l'équipe",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Équipes", href: "/pilotages/teams" },
      {
        label: "Modifier l'équipe",
        href: "/pilotages/teams/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return <TeamUpdateForm team={data} />;
}
