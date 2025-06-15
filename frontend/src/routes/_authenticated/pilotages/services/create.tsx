import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ServiceCreateForm from "@/features/services/components/ServiceCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/services/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un service" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un service",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Services", href: "/pilotages/services" },
      {
        label: "Ajouter un service",
        href: "/pilotages/services/create",
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <ServiceCreateForm />;
}
