import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import RequestTypeServiceCategoryCreateForm from "@/features/request-type-service-categories/components/RequestTypeServiceCategoryCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-type-service-categories/create"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.REQUEST_TYPE_SERVICE_CATEGORIES.CREATE,
  ]),
  head: () => ({
    meta: [{ title: "Associer catégories de services & type de demande" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement de la catégorie de service par type de demande"
      message={error.message}
    />
  ),
  staticData: {
    title: "Associer catégories de services & type de demande",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Catégories de services par type de demande",
        href: "/pilotages/request-type-service-categories",
      },
      {
        label: "Associer catégories de services & type de demande",
        href: "/pilotages/request-type-service-categories/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <RequestTypeServiceCategoryCreateForm />;
}
