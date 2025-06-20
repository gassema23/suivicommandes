import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";
import DeliverableDelayRequestTypeCreateForm from "@/features/deliverable-delay-request-types/components/DeliverableDelayRequestTypeCreateForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverable-delay-request-types/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLE_DELAY_REQUEST_TYPES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un type de demande de délai de livraison" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un type de demande de délai de livraison",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Type de demande de délai de livraison",
        href: "/pilotages/deliverable-delay-request-types",
      },
      {
        label: "Ajouter un type de demande de délai de livraison",
        href: "/pilotages/deliverable-delay-request-types/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={5} />,
});

function RouteComponent() {
  return <DeliverableDelayRequestTypeCreateForm />;
}
