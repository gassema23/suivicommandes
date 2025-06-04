import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { providerServiceCategoryColumns } from "@/features/provider-service-categories/components/ProviderServiceCategoryColumns";
import { getProviderServiceCategories } from "@/features/provider-service-categories/services/get-provider-service-categories.service";
import { DataTable } from "@/features/common/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ProviderServiceCategoryResponse } from "@/features/provider-service-categories/types/provider-service-category.type";
import { QUERY_KEYS } from "@/config/query-key";

const providerServiceCategoriesQueryOptions =
  queryOptions<ProviderServiceCategoryResponse>({
    queryKey: QUERY_KEYS.PROVIDER_SERVICE_CATEGORIES,
    queryFn: () => getProviderServiceCategories(),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/provider-service-categories/"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.PROVIDER_SERVICE_CATEGORIES.READ,
  ]),
  head: () => ({
    meta: [{ title: "Fournisseurs par services" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(providerServiceCategoriesQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des fournisseurs par services"
      message={error.message}
    />
  ),
  staticData: {
    title: "Fournisseurs par services",
    action: "/pilotages/provider-service-categories/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Fournisseurs par services",
        href: "/pilotages/provider-service-categories",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: providerServiceCategories } =
    useSuspenseQuery<ProviderServiceCategoryResponse>(
      providerServiceCategoriesQueryOptions
    );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Ajoute la fonction onDelete à chaque ligne
  const dataWithDelete = {
    ...providerServiceCategories,
    data: (providerServiceCategories.data ?? []).map(
      (providerServiceCategory) => ({
        ...providerServiceCategory,
        onDelete: () => setDeleteId(providerServiceCategory.id),
      })
    ),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={providerServiceCategoryColumns}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="provider-service-categories"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.PROVIDER_SERVICE_CATEGORIES,
          });
        }}
      />
    </>
  );
}
