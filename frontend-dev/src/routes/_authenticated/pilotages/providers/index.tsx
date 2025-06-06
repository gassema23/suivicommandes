import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { providerColumns } from "@/features/providers/components/ProviderColumns";
import { getProviders } from "@/features/providers/services/get-providers.service";
import { DataTable } from "@/features/common/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ProviderResponse } from "@/features/providers/types/provider.type";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/features/common/constants/messages.constant";

const providersQueryOptions = (pageNumber: number) =>
  queryOptions<ProviderResponse>({
    queryKey: QUERY_KEYS.PROVIDERS_WITH_PAGE(pageNumber),
    queryFn: () => getProviders(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/providers/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.PROVIDERS.READ]),
  head: () => ({
    meta: [{ title: "Fournisseurs" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      providersQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des fournisseurs"
      message={error.message}
    />
  ),
  staticData: {
    title: "Fournisseurs",
    action: "/pilotages/providers/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Fournisseurs", href: "/pilotages/providers", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: providers } = useSuspenseQuery<ProviderResponse>(
    providersQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...providers,
    data: (providers.data ?? []).map((provider) => ({
      ...provider,
      onDelete: () => setDeleteId(provider.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={providerColumns}
        currentPage={pageNumber}
        totalPages={providers.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="providers"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Fournisseur"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDERS });
        }}
      />
    </>
  );
}
