import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/config/query-key";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { DataTable } from "@/features/common/table/DataTable";
import { teamColumns } from "@/features/teams/components/TeamColumns";
import { getTeams } from "@/features/teams/services/get-teams.service";
import type { TeamResponse } from "@/features/teams/types/team.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const teamsQueryOptions = queryOptions<TeamResponse>({
  queryKey: QUERY_KEYS.TEAMS,
  queryFn: () => getTeams(),
});

export const Route = createFileRoute("/_authenticated/pilotages/teams/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.TEAMS.READ]),
  head: () => ({
    meta: [{ title: "Équipes" }],
  }),

  loader: ({ context }) =>
    context.queryClient.ensureQueryData(teamsQueryOptions),

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
  const { data: teams } = useSuspenseQuery<TeamResponse>(teamsQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Ajoute la fonction onDelete à chaque ligne
  const dataWithDelete = {
    ...teams,
    data: (teams.data ?? []).map((team) => ({
      ...team,
      onDelete: () => setDeleteId(team.id),
    })),
  };

  return (
    <>
      <DataTable data={dataWithDelete} columns={teamColumns} />
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
