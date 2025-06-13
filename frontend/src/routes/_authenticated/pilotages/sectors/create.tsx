import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import SectorCreateForm from "@/features/sectors/components/SectorCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/sectors/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SECTORS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un secteur" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du secteur"
      message={error.message}
    />
  ),
  staticData: {
    title: "Ajouter un secteur",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Secteur", href: "/pilotages/sectors" },
      {
        label: "Ajouter un secteur",
        href: "/pilotages/sectors/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <SectorCreateForm />;
}
