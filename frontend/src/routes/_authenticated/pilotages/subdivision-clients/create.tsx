import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import SubdivisionClientCreateForm from "@/features/subdivision-clients/components/SubdivisionClientCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/subdivision-clients/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SUBDIVISION_CLIENTS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter une subdivision client" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des subdivisions clients"
      message={error.message}
    />
  ),
  staticData: {
    title: "Ajouter une subdivision client",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Subdivisions clients", href: "/pilotages/subdivision-clients" },
      {
        label: "Ajouter une subdivision client",
        href: "/pilotages/subdivision-clients/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <SubdivisionClientCreateForm />;
}
