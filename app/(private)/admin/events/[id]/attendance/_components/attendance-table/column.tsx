"use client";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, MenuIcon, TabletSmartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { TMemberAttendeesWithRegistrationAssistance } from "@/types";
import UserAvatar from "@/components/user-avatar";
import { format } from "date-fns";

const Actions = ({
    member,
}: {
    member: TMemberAttendeesWithRegistrationAssistance;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="size-7 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none shadow-2" align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${member.passbookNumber}`
                        );
                        toast.success("coppied");
                    }}
                >
                    <Copy strokeWidth={2} className="h-4" />
                    Copy passbook No.
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columns: ColumnDef<TMemberAttendeesWithRegistrationAssistance>[] = [
    // {
    //     id: "actions",
    //     header: ({ column }) => (
    //         <DataTableColHeader column={column} title="Actions" />
    //     ),
    //     cell: ({ row }) => (
    //         <div className="flex justify-start">
    //             <Actions member={row.original} />
    //         </div>
    //     ),
    // },
    {
        accessorKey: "passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="passbook no" />
        ),
        cell: ({ row }) => (
            <div className="">{row.original.passbookNumber}</div>
        ),
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="first name" />
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
                    <h1 className="font-medium whitespace-nowrap">{row.original.firstName}</h1>
                </div>
            );
        },
    },
    {
        accessorKey: "middleName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="middle name" />
        ),
        cell: ({ row }) => <div className="">{row.original.middleName}</div>,
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="last name" />
        ),
        cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
    },
    {
        id: "registered by",
        accessorKey: "registeredBy",
        header: ({ column }) => (
            <DataTableColHeader
                column={column}
                className="justify-center"
                title="registered by"
            />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 min-w-[200px] items-center justify-center">
                {row.original.registeredBy ? (
                    <div className="px-2 text-sm py-1 flex items-center justify-center gap-x-2 rounded-full bg-secondary text-[#457f5a] dark:text-[#68ca93]">
                        <UserAvatar
                            className="size-4"
                            src={row.original.registeredBy.picture as ""}
                            fallback={row.original.registeredBy.name.substring(
                                0,
                                2
                            )}
                        />
                        {row.original.registeredBy.name}
                    </div>
                ) : (
                    <div className="px-2 text-sm py-1 flex items-center justify-center gap-x-2 rounded-full bg-[#f0fdf5] dark:bg-[#f0fdf5]/5 text-[#457f5a] dark:text-[#68ca93]">
                        <TabletSmartphone className="size-3" />{" "}
                        <span>Self Registered</span>
                    </div>
                )}
            </div>
        ),
        filterFn: (row, id, value) => {
            if (row.original.registeredBy)
                return value.includes(row.original.registeredBy.id.toString());
            return false;
        },
    },
    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="contact" />
        ),
        cell: ({ row }) => <div className="">{row.original.contact}</div>,
    },
    {
        accessorKey: "registeredAt",
        header: ({ column }) => (
            <DataTableColHeader
                column={column}
                title="Registration/Attendance Date"
            />
        ),
        cell: ({
            row: {
                original: { registeredAt },
            },
        }) => (
            <div className="">
                {registeredAt
                    ? format(registeredAt, "MMMM d, yyyy 'at' h:mm a")
                    : ""}
            </div>
        ),
    },
    {
        accessorKey: "emailAddress",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="email" />
        ),
        cell: ({ row }) => <div className="">{row.original.emailAddress}</div>,
    },
    {
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="gender" />
        ),
        cell: ({ row }) => <div className="">{row.original.gender}</div>,
    },
];

export default columns;
