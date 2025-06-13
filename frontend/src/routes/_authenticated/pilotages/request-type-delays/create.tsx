import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import RequestTypeDelayCreateForm from "@/features/request-type-delays/components/RequestTypeDelayCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-type-delays/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPE_DELAYS.CREATE]),
  head: () => ({
    meta: [{ title: "Associer des délais à un type de demande" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des délais par type de demande"
      message={
        error.message ||
        "Une erreur inconnue est survenue. Veuillez réessayer plus tard."
      }
    />
  ),
  staticData: {
    title: "Associer des délais à un type de demande",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Délais par type de demande",
        href: "/pilotages/request-type-delays",
      },
      {
        label: "Associer des délais à un type de demande",
        href: "/pilotages/request-type-delays/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <RequestTypeDelayCreateForm />;
}
