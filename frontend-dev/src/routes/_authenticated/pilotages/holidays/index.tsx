import LoadingPage from "@/components/ui/loader/loading-page";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import { holidayColumns } from "@/features/holidays/components/holiday-columns";
import { getHolidays } from "@/features/holidays/services/getHolidays";
import { DataTable } from "@/features/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const holidaysQueryOptions = queryOptions({
  queryKey: ["holidays"],
  queryFn: () => getHolidays(),
});

export const Route = createFileRoute("/_authenticated/pilotages/holidays/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.HOLIDAYS.READ]),
  head: () => ({
    meta: [
      {
        name: "description",
        content: "",
      },
      {
        title: `Jour férié | ${APP_NAME}`,
      },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(holidaysQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des équipes"
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
  const { data } = useSuspenseQuery(holidaysQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Ajoute la fonction onDelete à chaque ligne
  const dataWithDelete = {
    ...data,
    data: data.data.map((holiday) => ({
      ...holiday,
      onDelete: () => setDeleteId(holiday.id),
    })),
  };

  return (
    <>
      <DataTable data={dataWithDelete} columns={holidayColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="holidays"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: ["holidays"] });
        }}
      />
    </>
  );
}
