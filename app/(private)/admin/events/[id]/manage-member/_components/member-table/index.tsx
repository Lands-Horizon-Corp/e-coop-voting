"use client";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { user } from "next-auth";
import { Role } from "@prisma/client";
import { GrRotateRight } from "react-icons/gr";
import useDebounce from "@/hooks/use-debounce";
import React, {
    useRef,
    useMemo,
    useState,
    useEffect,
    useCallback,
} from "react";

import {
    Plus,
    Send,
    Users,
    Mails,
    QrCode,
    ScanLine,
    SearchIcon,
    PersonStandingIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import ImportFileModal from "../modals/import-file-modal";
import LoadingSpinner from "@/components/loading-spinner";
import DataTable from "@/components/data-table/data-table";
import columns, { MembersCustomGlobalFilter } from "./column";
import CreateMemberModal from "../modals/create-member-modal";
import SkippedMemberModal from "../modals/skipped-member-modal";
import BulkExportPbQrModal from "../modals/bulk-export-pb-qr-modal";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import DataTableViewOptions from "@/components/data-table/data-table-view-options";
import DataTableBasicPagination2 from "@/components/data-table/data-table-basic-pagination-2";

import {
    useBroadcastOTP,
    useEventMembers,
} from "@/hooks/api-hooks/member-api-hook";

import { cn } from "@/lib/utils";
import { TEventWithElection } from "@/types";
import { useQrReaderModal } from "@/stores/use-qr-scanner";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { toast } from "sonner";
import DownloadableMailResponse from "./downloadable-mail-response";
import { useOnEventSubDataUpdate } from "@/hooks/use-event-update-poller";

type Props = {
    id: number;
    user: user;
    event: TEventWithElection;
};

interface SearchInputProps {
    value?: string;
    onChange: (val?: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ value, onChange }, ref) => {
        const [val, setVal] = useState(value);
        const debouncedValue = useDebounce(val, 500);

        useEffect(() => {
            onChange?.(debouncedValue);
        }, [debouncedValue, onChange]);

        return (
            <Input
                ref={ref}
                value={val}
                placeholder="Search..."
                onChange={(event) => setVal(event.target.value)}
                className="w-full pl-8 bg-popover text-muted-foreground placeholder:text-muted-foreground placeholder:text-[min(14px,3vw)] text-sm md:text-base ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        );
    }
);

SearchInput.displayName = "SearchInput";

const MemberTable = ({ id, user, event }: Props) => {
    const { onOpen } = useConfirmModal();
    const { onOpenQR } = useQrReaderModal();
    const { broadcastOTP, isBroadcasting } = useBroadcastOTP(id, (res) => {
        toast(<DownloadableMailResponse mailResponse={res} />, {
            duration: 1000 * 120,
        });
    });

    const [exportPbQrs, setExportPbQrs] = useState(false);
    const onFocusSearch = useRef<HTMLInputElement | null>(null);
    const [createMember, setCreateMember] = useState(false);
    const [onImportModal, setOnImportModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [onSkippedMemberModal, setOnSkippedMemberModal] = useState(false);

    const { data, isError, isLoading, isFetching, refetch } =
        useEventMembers(id);

    const handleEventHasSubChange = useCallback(() => refetch(), [refetch]);
    useOnEventSubDataUpdate({ eventId: id, onChange: handleEventHasSubChange });

    const memoizedColumns = useMemo(() => columns({ event }), [event]);

    const table = useReactTable({
        data,
        columns: memoizedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        initialState: {
            pagination: { pageIndex: 0, pageSize: 20 },
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: MembersCustomGlobalFilter,
    });

    useEffect(() => {
        const shortCutCommand = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey && event.key === "k") ||
                (event.altKey && event.key === "k") ||
                (event.metaKey && event.key === "k")
            ) {
                event.preventDefault();
                onFocusSearch.current?.focus();
            }
        };
        window.addEventListener("keydown", shortCutCommand);
        return () => {
            window.removeEventListener("keydown", shortCutCommand);
        };
    }, []);

    const isStaff = user.role === Role.staff;

    if (data === undefined)
        return <h1 className=" animate-pulse">Loading...</h1>;

    return (
        <div className="lg:space-y-5 space-y-2 min-h-[65vh] p-2">
            <BulkExportPbQrModal
                eventId={id}
                open={exportPbQrs}
                totalMembers={data.length}
                onOpenChange={(val) => setExportPbQrs(val)}
            />
            <div className="flex hiiden flex-wrap items-center p-2 justify-between rounded-t-xl gap-y-2 rounded border-b bg-background dark:border dark:bg-secondary/70 ">
                <CreateMemberModal
                    eventId={id}
                    state={createMember}
                    onClose={(state) => setCreateMember(state)}
                />
                <ImportFileModal
                    id={id}
                    onOpenSkippedModal={(state) =>
                        setOnSkippedMemberModal(state)
                    }
                    state={onImportModal}
                    onClose={(state) => setOnImportModal(state)}
                />
                <SkippedMemberModal
                    state={onSkippedMemberModal}
                    onClose={(state) => setOnSkippedMemberModal(state)}
                />
                <div className="flex lg:space-y-2 flex-col lg:flex-row lg:justify-between space-y-2 relative w-full items-center gap-x-4 text-muted-foreground">
                    <div className="w-full lg:w-fit relative">
                        <SearchIcon className="absolute w-4 h-auto top-3 text-muted-foreground left-2" />
                        <SearchInput
                            ref={onFocusSearch}
                            value={globalFilter}
                            onChange={(val) => setGlobalFilter(val ?? "")}
                        />
                    </div>
                    <div className="overflow-x-scroll max-w-full lg:max-w-none thin-scroll">
                        <div className="flex w-fit items-center space-x-1 flex-auto md:justify-end justify-evenly">
                            <div className="">
                                <ActionTooltip content="Scan Passbook Number">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="cursor-pointer  "
                                        onClick={() =>
                                            onOpenQR({
                                                onScan: (val) => {
                                                    if (val.length === 0)
                                                        return;
                                                    setGlobalFilter(
                                                        val[0].rawValue
                                                    );
                                                },
                                            })
                                        }
                                    >
                                        <ScanLine className="size-4" />
                                    </Button>
                                </ActionTooltip>
                            </div>
                            <DataTableViewOptions
                                className="h-10"
                                table={table}
                            />
                            <Button
                                variant={"secondary"}
                                disabled={isFetching}
                                onClick={() => refetch()}
                                className="gap-x-2"
                                size="icon"
                            >
                                {isFetching ? (
                                    <LoadingSpinner />
                                ) : (
                                    <GrRotateRight className="size-4" />
                                )}
                            </Button>
                            {!isStaff && (
                                <ActionTooltip
                                    side="top"
                                    align="center"
                                    content={
                                        <div className="flex items-center gap-x-2">
                                            <PersonStandingIcon className="size-4" />{" "}
                                            Add Specific Members.
                                        </div>
                                    }
                                >
                                    <Button
                                        size="sm"
                                        className={cn(
                                            "flex  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                        )}
                                        onClick={() => {
                                            setCreateMember(true);
                                        }}
                                    >
                                        <p>
                                            Add{" "}
                                            <span className="hidden lg:inline-block">
                                                Member
                                            </span>
                                        </p>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </ActionTooltip>
                            )}
                            {/* {!isStaff && (
                                <ActionTooltip
                                    side="top"
                                    align="center"
                                    content={
                                        <div className="flex items-center gap-x-2">
                                            <Users className="size-4" />
                                            Sync member&apos;s pictures from
                                            database
                                        </div>
                                    }
                                >
                                    <Button
                                        size="sm"
                                        className={cn(
                                            "flex-none flex  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                        )}
                                        disabled={
                                            true
                                            // isPendingUpdateMembersPicture ||
                                            // memberTableIsEmpty
                                        }
                                        onClick={() => {
                                            mutate({
                                                id: id,
                                            });
                                        }}
                                    >
                                        <p>
                                            <span className="hidden lg:inline-block">
                                                Sync Pictures
                                            </span>
                                        </p>
                                        {isRefetchingUpdateMembersPicture ? (
                                            <LoadingSpinner className="dark:text-black text-white " />
                                        ) : (
                                            <IoMdPhotos />
                                        )}
                                    </Button>
                                </ActionTooltip>
                            )} */}
                            <Button
                                size="sm"
                                className={cn(
                                    "flex  gap-x-2  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                )}
                                disabled={isBroadcasting}
                                onClick={() => setExportPbQrs(true)}
                            >
                                <p>
                                    <QrCode className="size-4 mr-1 inline" />
                                    Export PB QR
                                </p>
                            </Button>

                            {!isStaff && (
                                <ActionTooltip
                                    side="top"
                                    align="center"
                                    content={
                                        <div className="flex items-center gap-x-2">
                                            <Mails className="size-4" /> Send
                                            OTP to all members via email
                                            address.
                                        </div>
                                    }
                                >
                                    <Button
                                        size="sm"
                                        className={cn(
                                            "flex  gap-x-2  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                        )}
                                        disabled={isBroadcasting}
                                        onClick={() => {
                                            onOpen({
                                                title: "Bulk OPT Sending",
                                                description:
                                                    "You are about to send all members an OTP. Are you sure?",
                                                onConfirm: () => broadcastOTP(),
                                            });
                                        }}
                                    >
                                        {" "}
                                        <p>
                                            Send all{" "}
                                            <span className="hidden lg:inline-block">
                                                OTP
                                            </span>
                                        </p>
                                        {isBroadcasting ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </Button>
                                </ActionTooltip>
                            )}
                            {!isStaff && (
                                <ActionTooltip
                                    side="top"
                                    align="center"
                                    content={
                                        <div className="flex items-center gap-x-2">
                                            <Users className="size-4" /> Bulk
                                            Creation.
                                        </div>
                                    }
                                >
                                    <Button
                                        size="sm"
                                        className={cn(
                                            "flex-none flex  rounded-md justify-center items-center md:space-x-2 md:min-w-[7rem]"
                                        )}
                                        onClick={() => {
                                            setOnImportModal(true);
                                        }}
                                    >
                                        <p>
                                            csv{" "}
                                            <span className="hidden lg:inline-block">
                                                import
                                            </span>
                                        </p>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </ActionTooltip>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DataTable
                className="py-5 overflow-y-auto min-h-[65vh] overflow-auto overscroll-y-none flex-1 bg-background dark:bg-secondary/30 rounded-2xl"
                isError={isError}
                isLoading={isLoading || isFetching}
                table={table}
            />
            <div className="lg:hidden ">
                <DataTableBasicPagination2 table={table} />
            </div>
            <div className="hidden lg:block">
                <DataTablePagination
                    pageSizes={[20, 40, 60, 80, 100]}
                    table={table}
                />
            </div>
        </div>
    );
};

export default MemberTable;
