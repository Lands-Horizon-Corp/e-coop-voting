"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import { TMemberWithEventElectionId } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

const columns: ColumnDef<TMemberWithEventElectionId>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsSomeRowsSelected() || (table.getIsAllPageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    {
        accessorKey: "firstName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="first Name" />
        ),
        cell: ({ row }) => {
            const img =
                row.original.picture === null
                    ? "/images/default.png"
                    : row.original.picture;
            return (
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={img} />
                        <AvatarFallback className="bg-primary text-accent">
                            {row.original.firstName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="font-medium">{row.original.firstName.toUpperCase()}</h1>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="last Name" />
        ),
        cell: ({ row }) => <div className=""> {row.original.lastName.toUpperCase()}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "middleName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="middle" />
        ),
        cell: ({ row }) => <div className="">{row.original.middleName?.toUpperCase()}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="passbook N0." />
        ),
        cell: ({ row }) => (
            <div className="">{row.original.passbookNumber}</div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
  
];

export default columns;
