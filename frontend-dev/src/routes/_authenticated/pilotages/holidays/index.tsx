import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/features/common/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/common/authorizations/types/auth.types";
import { holidayColumns } from "@/features/holidays/components/holidayColumns";
import { getHolidays } from "@/features/holidays/services/get-holidays.service";
import { DataTable } from "@/features/common/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { HolidayResponse } from "@/features/holidays/types/holiday.type";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import { SUCCESS_MESSAGES } from "@/features/common/constants/messages.constant";
import { toast } from "sonner";

const holidaysQueryOptions = (pageNumber: number) =>
  queryOptions<HolidayResponse>({
    queryKey: QUERY_KEYS.HOLIDAYS_WITH_PAGE(pageNumber),
    queryFn: () => getHolidays(pageNumber),
  });

export const Route = createFileRoute("/_authenticated/pilotages/holidays/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.HOLIDAYS.READ]),
  head: () => ({
    meta: [{ title: "Jour férié" }],
  }),
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  loader: (args) => {
    const { context, search } = args as any;
    return context.queryClient.ensureQueryData(
      holidaysQueryOptions(Number(search?.page ?? "1"))
    );
  },
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des jours fériés"
      message={error.message}
    />
  ),
  staticData: {
    title: "Jour férié",
    action: "/pilotages/holidays/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Jour férié", href: "/pilotages/holidays", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page = 1 } = Route.useSearch();
  const pageNumber = Number(page);

  const { data: holidays } = useSuspenseQuery<HolidayResponse>(
    holidaysQueryOptions(pageNumber)
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dataWithDelete = {
    ...holidays,
    data: (holidays.data ?? []).map((holiday) => ({
      ...holiday,
      onDelete: () => setDeleteId(holiday.id),
    })),
  };

  return (
    <>
      <DataTable
        data={dataWithDelete}
        columns={holidayColumns}
        currentPage={pageNumber}
        totalPages={holidays.meta.totalPages}
        onPageChange={(page) => navigate({ search: { page } })}
      />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="holidays"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          toast.success(SUCCESS_MESSAGES.delete("Jour férié"));
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOLIDAYS });
        }}
      />
    </>
  );
}
