import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { momentFr } from "@/lib/momentFr";
import DataTableAction from "@/features/table/components/DataTableAction";
import { DataTableColumnHeader } from "@/features/table/components/DataTableColumnHeader";
import type { User } from "../types/user.type";
import { Badge } from "@/components/ui/quebec/Badge";

momentFr();

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Nom",
    cell: ({ row }) => {
      return row.original.fullName;
    },
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adresse courriel" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "team",
    cell: ({ row }) => {
      return row.original?.team?.teamName &&
        row.original?.team?.teamName !== "Aucun" ? (
        <Badge className="capitalize">{row.original.team?.teamName}</Badge>
      ) : (
        <Badge variant="secondary">Non attribué</Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Équipe" />
    ),
    enableSorting: true,
    enableColumnFilter: true,
  },{
    accessorKey: "role",
    cell: ({ row }) => {
      return row.original?.role?.roleName &&
        row.original?.role?.roleName !== "Aucun" ? (
        <Badge className="capitalize">{row.original.role.roleName}</Badge>
      ) : (
        <Badge variant="secondary">Non attribué</Badge>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
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
          baseUrl="/pilotages/users/update/$id"
          onDelete={row.original.onDelete}
          resource="users"
        />
      );
    },
  },
];
