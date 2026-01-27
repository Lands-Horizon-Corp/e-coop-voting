"use client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Copy, Image, Loader2, MenuIcon, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TCoopWBranch } from "@/types";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { deleteBranch } from "@/hooks/api-hooks/branch-api-hooks";
import UserAvatar from "@/components/user-avatar";
import UpdateCoopModal from "../modals/update-coop-modal";
import { useDeleteCoop } from "@/hooks/api-hooks/coop-api-hooks";

const Actions = ({ coop }: { coop: TCoopWBranch }) => {
    const [modal, setModal] = useState(false);
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const { deleteCoop, isDeletingCoop } = useDeleteCoop();

    if (isDeletingCoop)
        return <Loader2 className="h-4 text-foreground/70 animate-spin" />;

    return (
        <>
            <DropdownMenu>
                <UpdateCoopModal
                    coop={coop}
                    state={modal}
                    onClose={(state) => setModal(state)}
                />
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        <MenuIcon className="size-5 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none shadow-2" align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="px-2 gap-x-2" onClick={() => { }}>
                        <Copy strokeWidth={2} className="h-4" />
                        Copy Coop ID
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() => setModal(true)}
                    >
                        <Pencil strokeWidth={2} className="h-4" /> Edit Coop
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Delete Coop 🗑️",
                                description:
                                    "Are you sure to delete this coop? Everything under the coop will be deleted, branches, users, events etc, will be deleted. Do you wish to proceed?",
                                onConfirm: () => deleteCoop(coop.id),
                            })
                        }
                        className="px-2 gap-x-2 text-destructive"
                    >
                        <Trash strokeWidth={2} className="h-4" />
                        Delete Coop
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

const columns: ColumnDef<TCoopWBranch>[] = [
    {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColHeader className="w-fit" column={column} title="Actions" />
        ),
        cell: ({ row }) => (
            <div className="flex w-fit justify-start">
                <Actions coop={row.original} />
            </div>
        ),
    },
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColHeader column={column} title="ID" />,
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
        enableHiding: false,
    },
    {
        id: "Coopearative Name",
        accessorKey: "coopName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Cooperative Name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                <UserAvatar
                    className="size-10"
                    src={row.original.coopLogo ?? "/images/default.png"}
                    fallback={row.original.coopName.substring(
                        0,
                        row.original.coopName.length >= 2
                            ? 2
                            : row.original.coopName.length,
                    )}
                />
                {row.original.coopName}
            </div>
        ),
    },

    {
        id: "Branches",
        accessorKey: "branches",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Branches" />
        ),
        cell: ({ row }) => <div className="">{row.original.branches.length}</div>,
        filterFn: (row, id, value) => {
            return row.original.branches.length.toString() === value;
        },
    },
    {
        id: "Date created",
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Date Created" />
        ),
        cell: ({ row }) => (
            <div className="">
                {" "}
                {format(new Date(row.original.createdAt), "MMM dd, y")}
            </div>
        ),
    },
];

export default columns;
