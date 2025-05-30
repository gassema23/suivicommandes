import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/pilotages/users/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.USERS.READ], undefined,  true),
  head: () => ({
    meta: [
      {
        name: "description",
        content: "",
      },
      {
        title: `Utilisateurs | ${APP_NAME}`,
      },
    ],
  }),
  component: RouteComponent,
  staticData: {
    title: 'Utilisateurs',
  },
});

function RouteComponent() {
  return (
    <div>
      Hello "/users/"!
    </div>
  );
}
