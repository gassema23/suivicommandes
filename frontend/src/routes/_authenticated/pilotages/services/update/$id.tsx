import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import ServiceUpdateForm from "@/features/services/components/ServiceUpdateForm";
import { fetchService } from "@/features/services/services/fetch-service.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

const servicesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.SERVICE_WITH_ID(id),
    queryFn: () => fetchService(id),
  });


export const Route = createFileRoute(
  "/_authenticated/pilotages/services/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICES.UPDATE]),
  head: () => ({
    meta: [{ title: "Modifier le service" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Modifier le service",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Services", href: "/pilotages/services" },
      {
        label: "Modifier le service",
        href: "/pilotages/services/$id",
        isCurrent: true,
      },
    ],
  },
  pendingComponent: () => <LoadingForm rows={3} />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(servicesQueryOptions(id!));
  return <ServiceUpdateForm service={data} />;
}
