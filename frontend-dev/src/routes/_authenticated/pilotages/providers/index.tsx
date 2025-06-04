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
import { QUERY_KEYS } from "@/config/query-key";

const providersQueryOptions = queryOptions<ProviderResponse>({
  queryKey: QUERY_KEYS.PROVIDERS,
  queryFn: () => getProviders(),
});

export const Route = createFileRoute("/_authenticated/pilotages/providers/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.PROVIDERS.READ]),
  head: () => ({
    meta: [{ title: "Fournisseurs" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(providersQueryOptions),
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
  const { data: providers } = useSuspenseQuery<ProviderResponse>(
    providersQueryOptions
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Ajoute la fonction onDelete à chaque ligne
  const dataWithDelete = {
    ...providers,
    data: (providers.data ?? []).map((provider) => ({
      ...provider,
      onDelete: () => setDeleteId(provider.id),
    })),
  };

  return (
    <>
      <DataTable data={dataWithDelete} columns={providerColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="providers"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDERS });
        }}
      />
    </>
  );
}
