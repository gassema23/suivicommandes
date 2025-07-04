import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { Client } from "@/shared/clients/types/client.type";

momentFr();

type ClientWithDelete = Client & { onDelete: () => void };

export const clientColumns: ColumnDef<ClientWithDelete>[] = [
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "clientNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifiant du client" />
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
          baseUrl="/pilotages/clients/update/$id"
          onDelete={row.original.onDelete}
          resource="clients"
        />
      );
    },
  },
];
