import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import SubdivisionClientCreateForm from "@/features/subdivision-clients/components/SubdivisionClientCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/subdivision-clients/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SUBDIVISION_CLIENTS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter une subdivision client" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
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
  pendingComponent: () => <LoadingForm rows={3} />,
});

function RouteComponent() {
  return <SubdivisionClientCreateForm />;
}
