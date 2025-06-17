import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import RequestTypeCreateForm from "@/features/request-types/components/RequestTypeCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-types/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un type de demande" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un type de demande",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Types d de de demande", href: "/pilotages/request-types" },
      {
        label: "Ajouter un typee de demande",
        href: "/pilotages/request-types/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={2} />,
});

function RouteComponent() {
  return <RequestTypeCreateForm />;
}
