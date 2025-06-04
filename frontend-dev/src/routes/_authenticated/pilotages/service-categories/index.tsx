import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { ServiceCategoryColumns } from "@/features/service-categories/components/ServiceCategoryColumns";
import { getServiceCategories } from "@/features/service-categories/services/get-service-categories.service";
import { DataTable } from "@/features/common/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ServiceCategoryResponse } from "@/features/service-categories/types/service-category.type";
import { QUERY_KEYS } from "@/config/query-key";

const serviceCategoriesQueryOptions = queryOptions<ServiceCategoryResponse>({
  queryKey: QUERY_KEYS.SERVICE_CATEGORIES,
  queryFn: () => getServiceCategories(),
});

export const Route = createFileRoute(
  "/_authenticated/pilotages/service-categories/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICE_CATEGORIES.READ]),
  head: () => ({
    meta: [{ title: "Catégories de services" }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(serviceCategoriesQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des catégories de services"
      message={error.message}
    />
  ),
  staticData: {
    title: "Catégories de services",
    action: "/pilotages/service-categories/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Catégories de services",
        href: "/pilotages/service-categories",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: serviceCategories } = useSuspenseQuery<ServiceCategoryResponse>(
    serviceCategoriesQueryOptions
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...serviceCategories,
    data: (serviceCategories.data ?? []).map((serviceCategory) => ({
      ...serviceCategory,
      onDelete: () => setDeleteId(serviceCategory.id),
    })),
  };
  return (
    <>
      <DataTable data={dataWithDelete} columns={ServiceCategoryColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="service-categories"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICE_CATEGORIES });
        }}
      />
    </>
  );
}
