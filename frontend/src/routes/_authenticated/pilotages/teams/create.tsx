import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import TeamCreateForm from "@/features/teams/components/TeamCreateForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/pilotages/teams/create")({
  beforeLoad: createPermissionGuard([PERMISSIONS.TEAMS.CREATE]),
  head: () => ({
    meta: [{ title: "Ajouter une équipe" }],
  }),
  errorComponent: ({ error }) => (
    <FormError title="Erreur lors du chargement" message={error.message} />
  ),
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

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  return <TeamCreateForm />;
}
