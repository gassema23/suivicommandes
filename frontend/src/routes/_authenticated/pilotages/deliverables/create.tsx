import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import DeliverableCreateForm from "@/features/deliverables/components/DeliverableCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverables/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un livrable" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
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
    pendingComponent: () => <LoadingForm rows={2} />,
});

function RouteComponent() {
  return <DeliverableCreateForm />;
}
