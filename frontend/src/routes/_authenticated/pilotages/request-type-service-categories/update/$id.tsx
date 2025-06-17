import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import RequestTypeServiceCategoryUpdateForm from "@/features/request-type-service-categories/components/RequestTypeServiceCategoryUpdateForm";
import { fetchRequestTypeServiceCategory } from "@/features/request-type-service-categories/services/fetch-request-type-service-category.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

const requestTypeServiceCategoriesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.REQUEST_TYPE_SERVICE_CATEGORY_WITH_ID(id),
    queryFn: () => fetchRequestTypeServiceCategory(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-type-service-categories/update/$id"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.REQUEST_TYPE_SERVICE_CATEGORIES.UPDATE,
  ]),
  head: () => ({
    meta: [
      {
        title:
          "Modifier l'association catégories de services & type de demande",
      },
    ],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier l'association catégories de services & type de demande",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Catégories de services par type de demande",
        href: "/pilotages/request-type-service-categories",
      },
      {
        label:
          "Modifier l'association catégories de services & type de demande",
        href: "/pilotages/request-type-service-categories/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingForm rows={7} />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(
    requestTypeServiceCategoriesQueryOptions(id!)
  );
  return (
    <RequestTypeServiceCategoryUpdateForm requestTypeServiceCategory={data} />
  );
}
