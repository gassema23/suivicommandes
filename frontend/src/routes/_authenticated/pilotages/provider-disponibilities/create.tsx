import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ProviderDisponibilityCreateForm from "@/features/provider-disponibilities/components/ProviderDisponibilityCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/provider-disponibilities/create"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.PROVIDER_DISPONIBILITIES.CREATE,
  ]),
  head: () => ({
    meta: [{ title: "Ajouter une disponibilité fournisseur" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter une disponibilité fournisseur",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Disponibilités fournisseur",
        href: "/pilotages/provider-disponibilities",
      },
      {
        label: "Ajouter une disponibilité fournisseur",
        href: "/pilotages/provider-disponibilities/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <ProviderDisponibilityCreateForm />;
}
