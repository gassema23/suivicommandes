import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import DelayTypeCreateForm from "@/features/delay-types/components/DelayTypeCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/delay-types/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELAY_TYPES.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un type de délai" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un type de délai",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Types de délai", href: "/pilotages/delay-types" },
      {
        label: "Ajouter un type de délai",
        href: "/pilotages/delay-types/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={2} />,
});

function RouteComponent() {
  return <DelayTypeCreateForm />;
}
