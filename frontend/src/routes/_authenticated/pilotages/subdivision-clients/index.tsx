import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { DataTable } from "@/components/table/DataTable";
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
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

const subdivisionClientsQueryOptions = (pageNumber: number) =>
  queryOptions<SubdivisionClientResponse>({
    queryKey: QUERY_KEYS.SUBDIVISION_CLIENTS_WITH_PAGE(pageNumber),
    queryFn: () => getSubdivisionClients(pageNumber),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/subdivision-clients/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SUBDIVISION_CLIENTS.READ]),
  head: () => ({
    meta: [{ title: "Subdivisions clients" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      subdivisionClientsQueryOptions(Number(search?.page ?? "1"))
    );
  },
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
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: subdivisionClients } =
    useSuspenseQuery<SubdivisionClientResponse>(
      subdivisionClientsQueryOptions(pageNumber)
    );

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
      <DataTable
        data={dataWithDelete}
        columns={SubdivisionClientColumns}
        currentPage={pageNumber}
        totalPages={subdivisionClients.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="subdivision-clients"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Subdivision client"));
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.SUBDIVISION_CLIENTS,
          });
        }}
      />
    </>
  );
}
