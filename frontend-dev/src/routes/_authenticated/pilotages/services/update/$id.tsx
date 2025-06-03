import LoadingPage from '@/components/ui/loader/LoadingPage'
import FormError from '@/components/ui/shadcn/form-error'
import { APP_NAME } from '@/config'
import { createPermissionGuard } from '@/features/authorizations/helpers/createPermissionGuard'
import { PERMISSIONS } from '@/features/authorizations/types/auth.types'
import ServiceUpdateForm from '@/features/services/components/ServiceUpdateForm'
import { fetchService } from '@/features/services/services/fetch-service.service'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'


const servicesQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["services", id],
    queryFn: () => fetchService(id),
  });


export const Route = createFileRoute(
  '/_authenticated/pilotages/services/update/$id',
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.SERVICES.UPDATE]),
  
    loader: ({ context, params }) =>
      context.queryClient.ensureQueryData(servicesQueryOptions(params.id)),
    head: () => ({
      meta: [{title: `Modifier le service | ${APP_NAME}`}],
    }),
    errorComponent: ({ error }) => (
      <FormError
        title="Erreur lors du chargement du service"
        message={error.message}
      />
    ),
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
  
    pendingComponent: () => <LoadingPage />,
    component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(servicesQueryOptions(id!));
  return <ServiceUpdateForm service={data} />;
}
