import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverable-delay-flows/"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLE_DELAY_FLOWS.READ]),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/pilotages/deliverable-delay-flows/"!</div>;
}
