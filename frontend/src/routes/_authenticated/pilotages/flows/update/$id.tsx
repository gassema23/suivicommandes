import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import FlowUpdateForm from "@/features/flows/components/FlowUpdateForm";
import { fetchFlow } from "@/features/flows/services/fetch-flow.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const flowQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.FLOW_WITH_ID(id),
    queryFn: () => fetchFlow(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/flows/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.FLOWS.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(flowQueryOptions(params.id)),
  head: () => ({
    meta: [{ title: "Modifier le flux de transmission" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier le flux de transmission",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Flux de transmissions", href: "/pilotages/flows" },
      {
        label: "Modifier le flux de transmission",
        href: "/pilotages/flows/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(flowQueryOptions(id!));
  return <FlowUpdateForm flow={data} />;
}
