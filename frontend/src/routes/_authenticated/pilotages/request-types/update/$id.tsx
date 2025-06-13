import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import RequestTypeUpdateForm from "@/features/request-types/components/RequestTypeUpdateForm";
import { fetchRequestType } from "@/features/request-types/services/fetch-request-type.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const requestTypeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.REQUEST_TYPE_WITH_ID(id),
    queryFn: () => fetchRequestType(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/request-types/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.REQUEST_TYPES.UPDATE]),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(requestTypeQueryOptions(params.id)),
  head: () => ({
    meta: [{ title: "Modifier le type de demande" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier le type de demande",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Types de demande", href: "/pilotages/request-types" },
      {
        label: "Modifier le type de demande",
        href: "/pilotages/request-types/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(requestTypeQueryOptions(id!));
  return <RequestTypeUpdateForm requestType={data} />;
}
