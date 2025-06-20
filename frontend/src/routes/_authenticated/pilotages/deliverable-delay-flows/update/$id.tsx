import LoadingForm from "@/components/ui/loader/LoadingForm";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import DeliverableDelayFlowUpdateForm from "@/features/deliverable-delay-flows/components/DeliverableDelayFlowUpdateForm";
import { fetchDeliverableDelayFlow } from "@/features/deliverable-delay-flows/services/fetch-deliverable-delay-flow.service";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const deliverableDelayFlowQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.DELIVERABLE_DELAY_FLOW_WITH_ID(id),
    queryFn: () => fetchDeliverableDelayFlow(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverable-delay-flows/update/$id"
)({
  beforeLoad: createPermissionGuard([
    PERMISSIONS.DELIVERABLE_DELAY_FLOWS.UPDATE,
  ]),
  head: () => ({
    meta: [{ title: "Modifier un délai de livraison des flux" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier un délai de livraison des flux",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Délai de livraison des flux",
        href: "/pilotages/deliverable-delay-flows",
      },
      {
        label: "Modifier un délai de livraison des flux",
        href: "/pilotages/deliverable-delay-flows/update/$id",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={6} />,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(deliverableDelayFlowQueryOptions(id!));
  return <DeliverableDelayFlowUpdateForm deliverableDelayFlow={data} />;
}
