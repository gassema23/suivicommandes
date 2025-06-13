import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";
import type { SubdivisionClient } from "../types/subdivision-client.type";

momentFr();

export const SubdivisionClientColumns: ColumnDef<SubdivisionClient>[] = [
  {
    accessorKey: "clientId",
    cell: ({ row }) => {
      const client = row.original.client;
      return client ? client.virtualClientName : "Secteur inconnu";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "subdivisionClientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subdivision Client" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "subdivisionClientNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifiant de la subdivision client" />
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
          baseUrl="/pilotages/subdivision-clients/update/$id"
          onDelete={row.original.onDelete}
          resource="subdivision_clients"
        />
      );
    },
  },
];
