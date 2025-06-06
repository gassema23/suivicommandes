import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import FlowCreateForm from "@/features/flows/components/FlowCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/pilotages/flows/create")({
  beforeLoad: createPermissionGuard([PERMISSIONS.FLOWS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un flux de transmission" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du flux de transmission"
      message={error.message}
    />
  ),
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
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <FlowCreateForm />;
}
