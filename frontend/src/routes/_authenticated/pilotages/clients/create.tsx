import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ClientCreateForm from "@/features/clients/components/ClientCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/clients/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.CLIENTS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un client" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un client",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Clients", href: "/pilotages/clients" },
      {
        label: "Ajouter un client",
        href: "/pilotages/clients/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm />,
});

function RouteComponent() {
  return <ClientCreateForm />;
}
