import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import ProviderServiceCategoryUpdateForm from "@/features/provider-service-categories/components/ProviderServiceCategoryUpdateForm";
import { fetchProviderServiceCategory } from "@/features/provider-service-categories/services/fetch-provider-service-category.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const providerServiceCategoriesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.PROVIDER_SERVICE_CATEGORY_WITH_ID(id),
    queryFn: () => fetchProviderServiceCategory(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/provider-service-categories/update/$id"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.PROVIDER_SERVICE_CATEGORIES.UPDATE,
  ]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      providerServiceCategoriesQueryOptions(params.id)
    ),
  head: () => ({
    meta: [{ title: "Modifier l'association fournisseur & service" }],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du fournisseur"
      message={error.message}
    />
  ),
  staticData: {
    title: "Modifier l'association fournisseur & service",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Fournisseurs par services",
        href: "/pilotages/provider-service-categories",
      },
      {
        label: "Modifier l'association fournisseur & service",
        href: "/pilotages/provider-service-categories/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(providerServiceCategoriesQueryOptions(id!));
  return <ProviderServiceCategoryUpdateForm providerServiceCategory={data} />;
}
