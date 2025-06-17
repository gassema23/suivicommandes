import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import HolidayCreateForm from "@/features/holidays/components/holidayCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute(
  "/_authenticated/pilotages/holidays/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.HOLIDAYS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter un jour férié" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter un jour férié",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Jour férié", href: "/pilotages/holidays" },
      {
        label: "Ajouter un jour férié",
        href: "/pilotages/holidays/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={3} />,
});

function RouteComponent() {
  return <HolidayCreateForm />;
}
