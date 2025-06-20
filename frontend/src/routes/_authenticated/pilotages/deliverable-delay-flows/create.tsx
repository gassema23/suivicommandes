import LoadingForm from "@/components/ui/loader/LoadingForm";
import FormError from "@/components/ui/shadcn/form-error";
import DeliverableDelayFlowCreateForm from "@/features/deliverable-delay-flows/components/DeliverableDelayFlowCreateForm";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverable-delay-flows/create"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.DELIVERABLE_DELAY_FLOWS.CREATE,
  ]),
  head: () => ({
    meta: [{ title: "Ajouter un délai de livraison des flux" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un délai de livraison des flux",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Délai de livraison des flux",
        href: "/pilotages/deliverable-delay-flows",
      },
      {
        label: "Ajouter un délai de livraison des flux",
        href: "/pilotages/deliverable-delay-flows/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={6} />,
});

function RouteComponent() {
  return <DeliverableDelayFlowCreateForm />;
}
