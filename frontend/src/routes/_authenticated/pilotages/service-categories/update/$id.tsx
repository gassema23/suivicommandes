import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ServiceCategoryUpdateForm from "@/features/service-categories/components/ServiceCategoryUpdateForm";
import { fetchServiceCategory } from "@/features/service-categories/services/fetch-service-category.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const serviceCategoriesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.SERVICE_CATEGORY_WITH_ID(id),
    queryFn: () => fetchServiceCategory(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/service-categories/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICE_CATEGORIES.UPDATE]),

  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      serviceCategoriesQueryOptions(params.id)
    ),
  head: () => ({
    meta: [{ title: "Modifier la catégorie de service" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier la catégorie de service",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Catégories de services",
        href: "/pilotages/service-categories",
      },
      {
        label: "Modifier la catégorie de service",
        href: "/pilotages/service-categories/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(serviceCategoriesQueryOptions(id!));
  return <ServiceCategoryUpdateForm serviceCategory={data} />;
}
