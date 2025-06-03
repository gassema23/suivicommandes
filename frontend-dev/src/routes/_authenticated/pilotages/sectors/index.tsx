import LoadingPage from "@/components/ui/loader/LoadingPage";
import { DeleteModal } from "@/components/ui/quebec/DeleteModal";
import FormError from "@/components/ui/shadcn/form-error";
import { APP_NAME } from "@/config";
import { createPermissionGuard } from "@/features/authorizations/helpers/createPermissionGuard";
import { PERMISSIONS } from "@/features/authorizations/types/auth.types";
import { SectorColumns } from "@/features/sectors/components/SectorColumns";
import { getSectors } from "@/features/sectors/services/get-sectors.service";
import { DataTable } from "@/features/table/DataTable";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const sectorsQueryOptions = queryOptions({
  queryKey: ["sectors"],
  queryFn: () => getSectors(),
});

export const Route = createFileRoute("/_authenticated/pilotages/sectors/")({
  beforeLoad: createPermissionGuard([PERMISSIONS.SECTORS.READ]),
  head: () => ({
    meta: [{ title: `Secteurs | ${APP_NAME}` }],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(sectorsQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement des secteurs"
      message={error.message}
    />
  ),
  staticData: {
    title: "Secteurs",
    action: "/pilotages/sectors/create",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Secteurs", href: "/pilotages/sectors", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(sectorsQueryOptions);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Ajoute la fonction onDelete à chaque ligne
  const dataWithDelete = {
    ...data,
    data: data.data.map((sector) => ({
      ...sector,
      onDelete: () => setDeleteId(sector.id),
    })),
  };
  return (
    <>
      <DataTable data={dataWithDelete} columns={SectorColumns} />
      <DeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        deleteUrl="sectors"
        deleteId={deleteId}
        onSuccess={() => {
          setDeleteId(null);
          queryClient.invalidateQueries({ queryKey: ["sectors"] });
        }}
      />
    </>
  );
}
