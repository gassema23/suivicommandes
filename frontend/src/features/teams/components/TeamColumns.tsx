import type { ColumnDef } from "@tanstack/react-table";
import type { Team } from "@/shared/teams/types/team.type";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/components/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/components/table/components/DataTableColumnHeader";

momentFr();

export const teamColumns: ColumnDef<Team>[] = [
  {
    accessorKey: "owner",
    header: "Propriétaire",
    cell: ({ row }) => {
      console.log("row", row.original);
      return row.original.owner.fullName || "Inconnu";
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Équipe" />
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
          baseUrl="/pilotages/teams/update/$id"
          onDelete={row.original.onDelete}
          resource="teams"
        />
      );
    },
  },
];
