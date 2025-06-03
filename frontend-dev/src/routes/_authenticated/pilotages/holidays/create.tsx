import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import HolidayCreateForm from "@/features/holidays/components/holidayCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/holidays/create"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.HOLIDAYS.CREATE]),
  head: () => ({
    meta: [{ title: `Ajouter un jour férié | ${APP_NAME}` }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du jour férié"
      message={error.message}
    />
  ),
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
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  return <HolidayCreateForm />;
}
