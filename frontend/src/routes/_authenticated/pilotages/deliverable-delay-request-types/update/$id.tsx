import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { createFileRoute, useParams } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { fetchDeliverableDelayRequestType } from "@/features/deliverable-delay-request-types/services/fetch-deliverable-delay-request-type.service";
import DeliverableDelayRequestTypeUpdateForm from "@/features/deliverable-delay-request-types/components/DeliverableDelayRequestTypeUpdateForm";

const deliverableDelayRequestTypeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.DELIVERABLE_DELAY_REQUEST_TYPE_WITH_ID(id),
    queryFn: () => fetchDeliverableDelayRequestType(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/deliverable-delay-request-types/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELIVERABLES.UPDATE]),
  head: () => ({
    meta: [{ title: "Modifier un type de demande de délai de livraison" }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier un type de demande de délai de livraison",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      {
        label: "Type de demande de délai de livraison",
        href: "/pilotages/deliverable-delay-request-types",
      },
      {
        label: "Modifier un type de demande de délai de livraison",
        href: "/pilotages/deliverable-delay-request-types/update/$id",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={5} />,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(deliverableDelayRequestTypeQueryOptions(id!));

  return <DeliverableDelayRequestTypeUpdateForm deliverableDelayRequestType={data} />;
}
