import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { DataTable } from "@/components/table/DataTable";
import { teamColumns } from "@/features/teams/components/TeamColumns";
import { getTeams } from "@/features/teams/services/get-teams.service";
import type { TeamResponse } from "@/shared/teams/types/team.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const teamsQueryOptions = (pageNumber: number) =>
  queryOptions<TeamResponse>({
    queryKey: QUERY_KEYS.TEAMS_WITH_PAGE(pageNumber),
    queryFn: () => getTeams(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/teams/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.TEAMS.READ]),
  head: () => ({
    meta: [{ title: "Équipes" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      teamsQueryOptions(Number(search?.page ?? "1"))
    );
  },

  component: TeamsPage,

  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des équipes"
      message={error.message}
    />
  ),
  staticData: {
    title: "Équipes",
    action: "/pilotages/teams/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Équipes", href: "/pilotages/teams", isCurrent: true },
    ],
  },

  pendingComponent: () => <LoadingPage />,
});

function TeamsPage() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: teams } = useSuspenseQuery<TeamResponse>(
    teamsQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...teams,
    data: (teams.data ?? []).map((team) => ({
      ...team,
      onDelete: () => setDeleteId(team.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={teamColumns}
        currentPage={pageNumber}
        totalPages={teams.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="teams"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TEAMS });
        }}
      />
    </>
  );
}
