import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ProviderServiceCategoryCreateForm from "@/features/provider-service-categories/components/ProviderServiceCategoryCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/provider-service-categories/create"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.PROVIDER_SERVICE_CATEGORIES.CREATE,
  ]),
  head: () => ({
    meta: [{ title: "Associer fournisseur & service" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du fournisseur par service"
      message={error.message}
    />
  ),
  staticData: {
    title: "Associer fournisseur & service",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Fournisseurs par services",
        href: "/pilotages/provider-service-categories",
      },
      {
        label: "Associer fournisseur & service",
        href: "/pilotages/provider-service-categories/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <ProviderServiceCategoryCreateForm />;
}
