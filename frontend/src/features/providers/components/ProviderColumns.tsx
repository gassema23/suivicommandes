import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { Provider } from "@/shared/providers/types/provider.type";

momentFr();

export const providerColumns: ColumnDef<Provider>[] = [
  {
    accessorKey: "providerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fournisseur" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "providerCode",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Identifiant du fournisseur"
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
          baseUrl="/pilotages/providers/update/$id"
          onDelete={row.original.onDelete}
          resource="providers"
        />
      );
    },
  },
];
