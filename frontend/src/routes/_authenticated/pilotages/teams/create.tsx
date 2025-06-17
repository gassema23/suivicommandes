import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import TeamCreateForm from "@/features/teams/components/TeamCreateForm";
import { createFileRoute } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

export const Route = createFileRoute("/_authenticated/pilotages/teams/create")({
  beforeLoad: createPermissionGuard([PERMISSIONS.TEAMS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter une équipe" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Ajouter une équipe",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Équipes", href: "/pilotages/teams" },
      {
        label: "Ajouter une équipe",
        href: "/pilotages/teams/create",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={3} />,
  component: RouteComponent,
});

function RouteComponent() {
  return <TeamCreateForm />;
}
