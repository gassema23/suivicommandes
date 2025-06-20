import TrackingOrderFormContainer from "@/features/tacking-orders/components/forms/TrackingOrderFormContainer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/applications/tracking-order/create"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <TrackingOrderFormContainer />;
}
