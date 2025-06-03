import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import { SubdivisionClientColumns } from "@/features/subdivision-clients/components/SubdivisionClientColumns";
import { getSubdivisionClients } from "@/features/subdivision-clients/services/get-subdivision-clients.service";
import { DataTable } from "@/features/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const subdivisionClientsQueryOptions = queryOptions({
  queryKey: ["subdivisionClients"],
  queryFn: () => getSubdivisionClients(),
});

export const Route = createFileRoute(
  "/_authenticated/pilotages/subdivision-clients/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SUBDIVISION_CLIENTS.READ]),
  head: () => ({
    meta: [{ title: `Subdivisions clients | ${APP_NAME}` }],
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
  const { data } = useSuspenseQuery(subdivisionClientsQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...data,
    data: data.data.map((subdivisionClient) => ({
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
        deleteUrl="subdivision_clients"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: ["subdivision_clients"] });
        }}
      />
    </>
  );
}
