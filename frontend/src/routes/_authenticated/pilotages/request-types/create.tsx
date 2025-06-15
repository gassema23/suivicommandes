import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import RequestTypeCreateForm from "@/features/request-types/components/RequestTypeCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-types/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un type de délai" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un type de délai",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Types de délai", href: "/pilotages/request-types" },
      {
        label: "Ajouter un type de délai",
        href: "/pilotages/request-types/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <RequestTypeCreateForm />;
}
