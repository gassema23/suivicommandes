import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { ProviderDisponibility } from "../types/provider-disponibility.type";

momentFr();

export const providerDisponibilityColumns: ColumnDef<ProviderDisponibility>[] =
  [
    {
      accessorKey: "providerDisponibilityName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Disponibilité fournisseur"
        />
      ),
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "updatedAt",
      header: "Dernière modification",
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        return moment(getValue<string>()).fromNow();
      },
    },
    {
      id: "id",
      accessorKey: "id",
      header: "",
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ row }) => {
        return (
          <DataTableAction
            id={row.original.id}
            baseUrl="/pilotages/provider-disponibilities/update/$id"
            onDelete={row.original.onDelete}
            resource="provider_disponibilities"
          />
        );
      },
    },
  ];
