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
import { toast } from "sonner";

const providerServiceCategoriesQueryOptions = (pageNumber: number) =>
  queryOptions<ProviderServiceCategoryResponse>({
    queryKey: QUERY_KEYS.PROVIDER_SERVICE_CATEGORIES_WITH_PAGE(pageNumber),
    queryFn: () => getProviderServiceCategories(pageNumber),
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
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      providerServiceCategoriesQueryOptions(Number(search?.page ?? "1"))
    );
  },
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
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: providerServiceCategories } =
    useSuspenseQuery<ProviderServiceCategoryResponse>(
      providerServiceCategoriesQueryOptions(pageNumber)
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
        currentPage={pageNumber}
        totalPages={providerServiceCategories.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="provider-service-categories"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(
            "Le fournisseur par service a été supprimé avec succès."
          );
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.PROVIDER_SERVICE_CATEGORIES,
          });
        }}
      />
    </>
  );
}
