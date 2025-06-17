import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { createPermissionGuard } from "@/shared/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/shared/authorizations/types/auth.types";
import { holidayColumns } from "@/features/holidays/components/holidayColumns";
import { getHolidays } from "@/features/holidays/services/get-holidays.service";
import { DataTable } from "@/components/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { HolidayResponse } from "@/features/holidays/types/holiday.type";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { toast } from "sonner";
import LoadingTable from "@/components/ui/loader/LoadingTable";

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
  errorComponent: ({ error }) => <FormError message={error.message} />,
  staticData: {
    title: "Jour férié",
    action: "/pilotages/holidays/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Jour férié", href: "/pilotages/holidays", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingTable rows={10} columns={4} />,
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
        deletePageName="holidays"
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
