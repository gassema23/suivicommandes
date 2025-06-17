import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import HolidayUpdateForm from "@/features/holidays/components/holidayUpdateForm";
import { fetchHoliday } from "@/features/holidays/services/fetch-holiday.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import LoadingForm from "@/components/ui/loader/LoadingForm";

const holidaysQueryOptions = (id: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.HOLIDAY_WITH_ID(id),
    queryFn: () => fetchHoliday(id),
  });

export const Route = createFileRoute(
  "/_authenticated/pilotages/holidays/update/$id"
)({
  beforeLoad: createPermissionGuard([PERMISSIONS.HOLIDAYS.UPDATE]),
  head: () => ({
    meta: [{ title: "Modifier le jour férié" }],
  }),
  errorComponent: ({ error }) => <FormError message={error.message} />,
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
  pendingComponent: () => <LoadingForm rows={3} />,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data } = useSuspenseQuery(holidaysQueryOptions(id!));
  return <HolidayUpdateForm holiday={data} />;
}
