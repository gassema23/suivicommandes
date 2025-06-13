import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { clientColumns } from "@/features/clients/components/ClientColumns";
import { getClients } from "@/features/clients/services/get-clients.service";
import { DataTable } from "@/components/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ClientResponse } from "@/shared/clients/types/client.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

const clientsQueryOptions = (pageNumber: number) =>
  queryOptions<ClientResponse>({
    queryKey: QUERY_KEYS.CLIENTS_WITH_PAGE(pageNumber),
    queryFn: () => getClients(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/clients/")({
  beforeLoad: () => createPermissionGuard([PERMISSIONS.CLIENTS.READ]),
  head: () => ({
    meta: [{ title: "Clients" }],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return { page: Number(search.page ?? 1) };
  },
  loader: ({ context, search }) => {
    return context.queryClient.ensureQueryData(
      clientsQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => <FormError message={error.message} />,
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
        deletePageName="clients"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Client"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
        }}
      />
    </>
  );
}
