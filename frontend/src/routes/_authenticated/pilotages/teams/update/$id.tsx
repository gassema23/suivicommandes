import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import TeamUpdateForm from "@/features/teams/components/TeamUpdateForm";
import { fetchTeam } from "@/features/teams/services/fetch-team.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const teamsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.TEAM_WITH_ID(id),
    queryFn: () => fetchTeam(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/teams/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.TEAMS.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(teamsQueryOptions(params.id)),
  head: () => ({
    meta: [{ title: "Modifier l'équipe" }],
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
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(teamsQueryOptions(id!));
  return <TeamUpdateForm team={data} />;
}
