import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/config/query-key";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { DataTable } from "@/features/common/table/DataTable";
import { SubdivisionClientColumns } from "@/features/subdivision-clients/components/SubdivisionClientColumns";
import { getSubdivisionClients } from "@/features/subdivision-clients/services/get-subdivision-clients.service";
import type { SubdivisionClientResponse } from "@/features/subdivision-clients/types/subdivision-client.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const subdivisionClientsQueryOptions = queryOptions<SubdivisionClientResponse>({
  queryKey: QUERY_KEYS.SUBDIVISION_CLIENTS,
  queryFn: () => getSubdivisionClients(),
});

export const Route = createFileRoute(
  "/_authenticated/pilotages/subdivision-clients/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SUBDIVISION_CLIENTS.READ]),
  head: () => ({
    meta: [{ title: "Subdivisions clients" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(subdivisionClientsQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des subdivisions clients"
      message={error.message}
    />
  ),
  staticData: {
    title: "Subdivisions clients",
    action: "/pilotages/subdivision-clients/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Subdivisions clients",
        href: "/pilotages/subdivision-clients",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: subdivisionClients } =
    useSuspenseQuery<SubdivisionClientResponse>(subdivisionClientsQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Ajoute la fonction onDelete à chaque ligne
  const dataWithDelete = {
    ...subdivisionClients,
    data: (subdivisionClients.data ?? []).map((subdivisionClient) => ({
      ...subdivisionClient,
      onDelete: () => setDeleteId(subdivisionClient.id),
    })),
  };

  return (
    <>
      <DataTable data={dataWithDelete} columns={SubdivisionClientColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="subdivision-clients"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBDIVISION_CLIENTS });
        }}
      />
    </>
  );
}
