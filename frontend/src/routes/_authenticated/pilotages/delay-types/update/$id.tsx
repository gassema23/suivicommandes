import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import DelayTypeUpdateForm from "@/features/delay-types/components/DelayTypeUpdateForm";
import { fetchDelayType } from "@/features/delay-types/services/fetch-delay-type.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

const delayTypeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.DELAY_TYPE_WITH_ID(id),
    queryFn: () => fetchDelayType(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/delay-types/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.DELAY_TYPES.UPDATE]),
  head: () => ({
    meta: [{ title: "Modifier le type de délai" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier le type de délai",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Types de délai", href: "/pilotages/delay-types" },
      {
        label: "Modifier le type de délai",
        href: "/pilotages/delay-types/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingForm rows={2} />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(delayTypeQueryOptions(id!));
  return <DelayTypeUpdateForm delayType={data} />;
}
