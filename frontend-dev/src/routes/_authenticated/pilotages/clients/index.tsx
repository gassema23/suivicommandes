import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { clientColumns } from "@/features/clients/components/ClientColumns";
import { getClients } from "@/features/clients/services/get-clients.service";
import { DataTable } from "@/features/common/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ClientResponse } from "@/features/clients/types/client.type";
import { QUERY_KEYS } from "@/config/query-key";

const clientsQueryOptions = queryOptions<ClientResponse>({
  queryKey: QUERY_KEYS.CLIENTS,
  queryFn: () => getClients(),
});

export const Route = createFileRoute("/_authenticated/pilotages/clients/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.CLIENTS.READ]),
  head: () => ({
    meta: [{ title: "Clients" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(clientsQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des clients"
      message={error.message}
    />
  ),
  staticData: {
    title: "Clients",
    action: "/pilotages/clients/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Clients", href: "/pilotages/clients", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: clients } =
    useSuspenseQuery<ClientResponse>(clientsQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Ajoute la fonction onDelete à chaque ligne
  const dataWithDelete = {
    ...clients,
    data: (clients.data ?? []).map((client) => ({
      ...client,
      onDelete: () => setDeleteId(client.id),
    })),
  };

  return (
    <>
      <DataTable data={dataWithDelete} columns={clientColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="clients"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
        }}
      />
    </>
  );
}
