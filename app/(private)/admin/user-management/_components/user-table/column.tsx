"use client";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import { Copy, Image, Loader2, MenuIcon, Pencil, Trash } from "lucide-react";

import UserAvatar from "@/components/user-avatar";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TUserWBranchCoop, TUserWithBranch } from "@/types";
import { deleteUser } from "@/hooks/api-hooks/user-api-hooks";
import UpdateUserModal from "../modals/update-user-modal";
import { useSession } from "next-auth/react";
import UpdateUserPictureModal from "../modals/update-user-image-modal";

const Actions = ({ user }: { user: TUserWBranchCoop }) => {
    const session = useSession();
    const [modal, setModal] = useState(false);
    const [modalPicture, setModalPicture] = useState(false);

    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const deleteOperation = deleteUser();

    if (deleteOperation.isPending || session.status === "loading")
        return <Loader2 className="h-4 text-foreground/70 animate-spin" />;

    if (
        (session.status === "unauthenticated" ||
            session.data === null ||
            session.data.user.role === user.role ||
            (user.role === "coop_root" && session.data.user.role !== "root") ||
            user.role === "root") &&
        user.id !== session.data?.user.id
    )
        return (
            <span className="text-xs text-foreground/40 italic">
                not allowed
            </span>
        );

    return (
        <DropdownMenu>
            <UpdateUserModal
                user={user}
                editor={session.data.user}
                state={modal}
                close={() => setModal(false)}
            />
            <UpdateUserPictureModal
                user={user}
                state={modalPicture}
                close={() => setModalPicture(false)}
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
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        navigator.clipboard.writeText(`${user.id}`);
                        toast.success("coppied");
                    }}
                >
                    <Copy strokeWidth={2} className="h-4" /> Copy user ID
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setModal(true)}
                    className="px-2 gap-x-2"
                >
                    <Pencil strokeWidth={2} className="h-4" /> Edit User
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setModalPicture(true)}
                    className="px-2 gap-x-2"
                >
                    <Image strokeWidth={2} className="h-4" /> Change Image
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        onOpenConfirmModal({
                            title: "Delete User 🗑️",
                            description:
                                "Are you sure to delete this account? The user will not be able to login.",
                            onConfirm: () => {
                                deleteOperation.mutate(user.id);
                            },
                        })
                    }
                    className="px-2 gap-x-2 text-destructive"
                >
                    <Trash strokeWidth={2} className="h-4" /> Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columns: ColumnDef<TUserWBranchCoop>[] = [
    {
        id: "actions",
        enableHiding: false,
        header: ({ column }) => (
            <DataTableColHeader
                column={column}
                title="Actions"
                className="w-fit"
            />
        ),
        cell: ({ row }) => (
            <div className="flex">
                <Actions user={row.original} />
            </div>
        ),
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="ID" />
        ),
        cell: ({ row }) => (
            <div className="font-medium uppercase">{row.original.id}</div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="name" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center text-nowrap">
                <UserAvatar
                    className="size-8"
                    src={row.original.picture ?? "/images/default.png"}
                    fallback={row.original.name.substring(0, 1)}
                />{" "}
                {row.original.name}
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Email" />
        ),
        cell: ({ row }) => <div className=""> {row.original.email}</div>,
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
            <div className="space-x-1">
                <span className="bg-secondary text-foreground/70 p-1 rounded-md">
                    {row.original.role ?? <i>no role assigned</i>}
                </span>
            </div>
        ),
        enableSorting: false,
    },
    {
        accessorKey: "branch",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Branch" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center">
                <UserAvatar
                    className="hidden lg:block size-8"
                    src={
                        row.original.branch.branchPicture ??
                        "/images/default.png"
                    }
                    fallback={row.original.branch.branchName.substring(
                        0,
                        row.original.branch.branchName.length >= 2
                            ? 2
                            : row.original.branch.branchName.length
                    )}
                />
                <span className="text-nowrap">
                    {row.original.branch.branchName}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "coop",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Cooperative" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-x-2 items-center text-nowrap">
                <UserAvatar
                    className="hidden lg:block size-8"
                    src={row.original.coop.coopLogo ?? "/images/default.png"}
                    fallback={row.original.coop.coopName.substring(
                        0,
                        row.original.coop.coopName.length >= 2
                            ? 2
                            : row.original.coop.coopName.length
                    )}
                />
                {row.original.coop.coopName}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Date joined" />
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
