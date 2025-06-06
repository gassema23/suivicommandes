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
import { toast } from "sonner";

const clientsQueryOptions = (pageNumber: number) =>
  queryOptions<ClientResponse>({
    queryKey: QUERY_KEYS.CLIENTS_WITH_PAGE(pageNumber),
    queryFn: () => getClients(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/clients/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.CLIENTS.READ]),
  head: () => ({
    meta: [{ title: "Clients" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      clientsQueryOptions(Number(search?.page ?? "1"))
    );
  },
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
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: clients } = useSuspenseQuery<ClientResponse>(
    clientsQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...clients,
    data: (clients.data ?? []).map((client) => ({
      ...client,
      onDelete: () => setDeleteId(client.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={clientColumns}
        currentPage={pageNumber}
        totalPages={clients.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="clients"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success("Client supprimé avec succès");
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
        }}
      />
    </>
  );
}
