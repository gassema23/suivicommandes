import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { DataTable } from "@/components/table/DataTable";
import { providerDisponibilityColumns } from "@/features/provider-disponibilities/components/ProviderDisponibilityColumns";
import { getProviderDisponibilities } from "@/features/provider-disponibilities/services/get-provider-disponibilities.service";
import type { ProviderDisponibilityResponse } from "@/features/provider-disponibilities/types/provider-disponibility.type";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";

const providerDisponibilitiesQueryOptions = (pageNumber: number) =>
  queryOptions<ProviderDisponibilityResponse>({
    queryKey: QUERY_KEYS.PROVIDER_DISPONIBILITIES_WITH_PAGE(pageNumber),
    queryFn: () => getProviderDisponibilities(pageNumber),
  });
export const Route = createFileRoute(
  "/_authenticated/pilotages/provider-disponibilities/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.PROVIDER_DISPONIBILITIES.READ]),
  head: () => ({
    meta: [{ title: "Disponibilités fournisseur" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      providerDisponibilitiesQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des disponibilités fournisseur"
      message={error.message}
    />
  ),
  staticData: {
    title: "Disponibilités fournisseur",
    action: "/pilotages/provider-disponibilities/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Disponibilités fournisseur",
        href: "/pilotages/provider-disponibilities",
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

  const { data: providerDisponibilities } = useSuspenseQuery<ProviderDisponibilityResponse>(
    providerDisponibilitiesQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...providerDisponibilities,
    data: (providerDisponibilities.data ?? []).map((providerDisponibility) => ({
      ...providerDisponibility,
      onDelete: () => setDeleteId(providerDisponibility.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={providerDisponibilityColumns}
        currentPage={pageNumber}
        totalPages={providerDisponibilities.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="provider-disponibilities"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Disponibilité fournisseur"));
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.PROVIDER_DISPONIBILITIES,
          });
        }}
      />
    </>
  );
}
