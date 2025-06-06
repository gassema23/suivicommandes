import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import DeliverableCreateForm from "@/features/deliverables/components/DeliverableCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverables/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un livrable" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du livrable"
      message={error.message}
    />
  ),
  staticData: {
    title: "Ajouter un livrable",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Livrables", href: "/pilotages/deliverables" },
      {
        label: "Ajouter un livrable",
        href: "/pilotages/deliverables/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <DeliverableCreateForm />;
}
