"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
    Copy,
    Trash,
    Users,
    Pencil,
    QrCode,
    Target,
    Loader2,
    MenuIcon,
    TouchpadOff,
    CheckCircle2,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CopyURL from "@/components/copy-url";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import UpdateEventModal from "../modals/update-event-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QrViewContent from "@/components/modals/modal-content/qr-view-content";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import {
    TEventWithElection,
    TEventWithElectionWithCoopWithBranch,
} from "@/types";
import useOrigin from "@/hooks/use-origin";
import { useInfoModal } from "@/stores/use-info-modal-store";
import { deleteEvent } from "@/hooks/api-hooks/event-api-hooks";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { cn } from "@/lib/utils";

const Actions = ({
    event,
}: {
    event: TEventWithElectionWithCoopWithBranch;
}) => {
    const router = useRouter();
    const session = useSession();
    const [onOpenModal, setOnOpenModal] = useState(false);

    const deleteOperation = deleteEvent();
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    if (deleteOperation.isPending || session.status === "loading")
        return <Loader2 className="h-4 text-foreground/70 animate-spin" />;

    if (
        session.status === "unauthenticated" ||
        session.data === null ||
        session.data.user.role === Role.staff
    )
        return (
            <span className="text-xs text-foreground/40 italic">
                not allowed
            </span>
        );

    return (
        <DropdownMenu>
            <UpdateEventModal
                event={event}
                user={session.data.user}
                state={onOpenModal}
                onClose={() => setOnOpenModal(false)}
            ></UpdateEventModal>
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
                        navigator.clipboard.writeText(`${event.id}`);
                        toast.success("coppied");
                    }}
                >
                    {" "}
                    <Copy strokeWidth={2} className="h-4" />
                    Copy event ID
                </DropdownMenuItem>
                {event.election && (
                    <>
                        <DropdownMenuItem
                            onClick={() => {
                                router.push(
                                    `/admin/events/${event.id}/election/${event.election?.id}/overview`
                                );
                            }}
                            className="px-2 gap-x-2"
                        >
                            <Users strokeWidth={2} className="h-4" />
                            event election
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (!event.election) return null;
                                router.push(
                                    `/admin/events/${event.id}/manage-member`
                                );
                            }}
                            className="px-2 gap-x-2"
                        >
                            <Target strokeWidth={2} className="h-4" />
                            manage
                        </DropdownMenuItem>
                    </>
                )}
                {event.election === null ? (
                    <DropdownMenuItem
                        onClick={() => {
                            router.push(
                                `/admin/events/${event.id}/manage-member`
                            );
                        }}
                        className="px-2 gap-x-2"
                    >
                        <Users strokeWidth={2} className="h-4" />
                        manage member
                    </DropdownMenuItem>
                ) : (
                    <></>
                )}
                <DropdownMenuItem
                    onClick={() => {
                        setOnOpenModal(true);
                    }}
                    className="px-2 gap-x-2"
                >
                    <Pencil strokeWidth={2} className="h-4" /> Edit Event
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={session.data.user.role !== "root"}
                    onClick={() =>
                        onOpenConfirmModal({
                            title: event.deleted
                                ? "Permanent Delete 🗑️"
                                : "Delete Event 🗑️",
                            description:
                                "Are you sure to delete this event permanently? This cannot be undone.",
                            onConfirm: () => {
                                deleteOperation.mutate(event.id);
                            },
                        })
                    }
                    className="px-2 gap-x-2 text-destructive"
                >
                    <Trash strokeWidth={2} className="h-4" />{" "}
                    {event.deleted ? "Permanent Delete" : "Delete"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const ViewEventQr = ({
    eventWithElection,
}: {
    eventWithElection: TEventWithElection;
}) => {
    const { onOpen } = useInfoModal();
    const { origin } = useOrigin();

    const eventUrl = `${origin}/events/${eventWithElection.id}/register`;
    const electionUrl = eventWithElection.election
        ? `${origin}/events/${eventWithElection.id}/election`
        : "";

    return (
        <Button
            onClick={() =>
                onOpen({
                    title: "Event QRCode",
                    description: "Available QR Code(s) for this event",
                    component: (
                        <div className="flex lg:flex-row justify-center gap-x-4 items-center pt-6">
                            <div className="flex flex-col gap-y-2 items-center">
                                <p className="text-center text-sm">
                                    Register QR
                                </p>
                                <QrViewContent
                                    qrClassName="size-[150px] lg:size-[250px]"
                                    fileName={
                                        eventWithElection.title +
                                        "-registration"
                                    }
                                    value={eventUrl}
                                    enableDownload
                                />
                                <CopyURL
                                    className="w-fit text-center flex justify-center"
                                    url={eventUrl}
                                />
                            </div>
                            {eventWithElection.election && (
                                <div className="flex flex-col gap-y-2 items-center">
                                    <p className="text-center text-sm">
                                        Election QR
                                    </p>
                                    <QrViewContent
                                        qrClassName="size-[150px] lg:size-[250px]"
                                        fileName={
                                            eventWithElection.title +
                                            "-election"
                                        }
                                        value={electionUrl}
                                        enableDownload
                                    />
                                    <CopyURL
                                        className="w-fit text-center flex justify-center"
                                        url={electionUrl}
                                    />
                                </div>
                            )}
                        </div>
                    ),
                    confirmString: "okay",
                })
            }
            size="icon"
            variant="ghost"
        >
            <QrCode className="size-6" strokeWidth={1} />
        </Button>
    );
};

const Cell = ({ text, className }: { text: string; className?: string }) => {
    return <p className={cn("text-[min(14px,2.9vw)]", className)}>{text}</p>;
};

const columns: ColumnDef<TEventWithElectionWithCoopWithBranch>[] = [
    {
        accessorKey: "actions",
        header: ({ column }) => (
            <div className="text-[min(12px,2.9vw)]  font-bold">Actions</div>
        ),
        enableHiding: false,
        cell: ({ row }) => (
            <div className="flex justify-start">
                <Actions event={row.original} />
            </div>
        ),
        enableSorting: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColHeader
                className="text-[min(12px,2.9vw)]"
                column={column}
                title="title"
            />
        ),
        cell: ({ row }) => {
            const img =
                row.original.coverImage === null
                    ? "/images/default.png"
                    : row.original.coverImage;
            return (
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={img} />
                        <AvatarFallback className="bg-primary text-accent">
                            {row.original.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <Cell text={row.original.title}></Cell>
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="description" />
        ),
        cell: ({ row }) => <Cell text={row.original.description}></Cell>,
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="date" />
        ),
        cell: ({ row }) => <Cell text={format(row.original.date, "MMM dd, yyyy")} className="text-nowrap"></Cell>,
    },
    {
        accessorKey: "branch",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="branch" />
        ),
        cell: ({ row }) => <Cell text={row.original.branch.branchName}></Cell>,
    },
    {
        accessorKey: "coop",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="coop" />
        ),
        cell: ({ row }) => <Cell text={row.original.coop.coopName}></Cell>,
    },
    {
        accessorKey: "Address",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Address" />
        ),
        cell: ({ row }) => <Cell text={row.original.location}></Cell>,
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="type" />
        ),
        cell: ({ row }) => <Cell text={row.original.category}></Cell>,
    },
    {
        id: "live",
        cell: ({ row }) => (
            <div className="">
                {row.original.election?.status === "live" && (
                    <div className="flex items-center justify-center space-x-2">
                        <p className=" bg-red-600 rounded-full size-2 translate-y-[0.20rem]"></p>
                        <Cell text="live"></Cell>
                    </div>
                )}
                {row.original.election?.status === "done" && (
                    <div className="flex items-center justify-center space-x-2">
                        <CheckCircle2 className="size-4 text-green-500"></CheckCircle2>
                        <Cell text="ended"></Cell>
                    </div>
                )}
                {row.original.election?.status === "pending" && (
                    <div className="flex items-center justify-center space-x-2">
                        <TouchpadOff className="size-4 text-yellow-500" />
                        <Cell text="unbegan"></Cell>
                    </div>
                )}
            </div>
        ),
    },
    {
        id: "Event QR",
        cell: ({ row }) => <ViewEventQr eventWithElection={row.original} />,
    },
    {
        id: "button",
        enableHiding: false,
        cell: ({ row }) => (
            <div className="flex justify-end">
                {row.original.election ? (
                    <Link
                        href={`/admin/events/${row.original.id}/manage-member`}
                    >
                        <Button size="sm" className=" rounded-xl h-8">
                            Manage Election
                        </Button>
                    </Link>
                ) : (
                    <Link
                        href={`/admin/events/${row.original.id}/manage-member`}
                    >
                        <Button size="sm" className=" rounded-xl h-8">
                            Manage
                        </Button>
                    </Link>
                )}
            </div>
        ),
    },
];

export default columns;
