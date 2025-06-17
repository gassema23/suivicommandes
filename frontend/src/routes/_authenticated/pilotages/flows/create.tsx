import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import FlowCreateForm from "@/features/flows/components/FlowCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute("/_authenticated/pilotages/flows/create")({
  beforeLoad: createPermissionGuard([PERMISSIONS.FLOWS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un flux de transmission" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un flux de transmission",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Flux de transmissions", href: "/pilotages/flows" },
      {
        label: "Ajouter un flux de transmission",
        href: "/pilotages/flows/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={2} />,
});

function RouteComponent() {
  return <FlowCreateForm />;
}
