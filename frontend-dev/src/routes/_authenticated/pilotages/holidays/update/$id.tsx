import LoadingPage from "@/components/ui/loader/loading-page";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import HolidayUpdateForm from "@/features/holidays/components/holiday-update-form";
import { fetchHoliday } from "@/features/holidays/services/fetchHoliday";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

const holidaysQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["holidays", id],
    queryFn: () => fetchHoliday(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/holidays/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.HOLIDAYS.UPDATE]),

  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(holidaysQueryOptions(params.id)),
  head: () => ({
    meta: [
      {
        name: "description",
        content: "",
      },
      {
        title: `Modifier le jour férié | ${APP_NAME}`,
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du jour férié"
      message={error.message}
    />
  ),
  staticData: {
    title: "Modifier le jour férié",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Jour férié", href: "/pilotages/holidays" },
      {
        label: "Modifier le jour férié",
        href: "/pilotages/holidays/update/$id",
        isCurrent: true,
      },
    ],
  },

  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(holidaysQueryOptions(id!));
  return <HolidayUpdateForm holiday={data} />;
}
