import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ConformityTypeCreateForm from "@/features/conformity-types/components/ConformityTypeCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/conformity-types/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.CONFORMITY_TYPES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un type de conformité" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un type de conformité",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Types de conformité", href: "/pilotages/conformity-types" },
      {
        label: "Ajouter un type de conformité",
        href: "/pilotages/conformity-types/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <ConformityTypeCreateForm />;
}
