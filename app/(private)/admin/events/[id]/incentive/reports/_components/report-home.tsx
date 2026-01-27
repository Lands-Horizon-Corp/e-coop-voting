"use client";
import { user } from "next-auth";
import { FaFilter } from "react-icons/fa";
import { GrRotateRight } from "react-icons/gr";
import React, { useRef, useState } from "react";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import FilterModal from "./modals/filter-modal";
import UserReportTable from "./user-report-table";
import LoadingSpinner from "@/components/loading-spinner";

import { isAllowed, tableToExcel } from "@/lib/utils";
import { useClaimReports } from "@/hooks/api-hooks/claim-report-api-hook";

type Props = { eventId: number; currentUser: user };

const ReportHome = ({ eventId, currentUser }: Props) => {
    const [filter, setFilter] = useState(false);
    const [ids, setIds] = useState<number[]>([]);
    const reportRef = useRef<HTMLTableElement | null>(null);

    const { reports, isLoading, isRefetching, refetch } = useClaimReports(
        eventId,
        ids,
    );

    const exportToExcel = () => {
        if (reportRef.current) {
            tableToExcel(reportRef.current, `event-${eventId}-claim-report`);
        }
    };

    const loading = isLoading;

    return (
        <div className="flex flex-col gap-y-2 p-4">
            <FilterModal
                state={filter}
                eventId={eventId}
                onClose={(state) => setFilter(state)}
                selectedIds={ids}
                setIds={(ids) => setIds(ids)}
            />

            <div className="flex justify-between">
                <p className="text-foreground/60 text-sm">Showing {reports.length} user report{reports.length > 1 ? 's' : ''}</p>
                <div className="flex items-center gap-x-1 justify-end">
                    <Button
                        variant={"secondary"}
                        onClick={() => refetch()}
                        className="gap-x-2"
                        size="icon"
                    >
                        <GrRotateRight className="size-4" />
                    </Button>
                    {
                        isAllowed(["root", "coop_root", "admin"], currentUser) &&
                        <Button
                            variant={"secondary"}
                            onClick={() => setFilter(!filter)}
                            className="gap-x-2"
                        >
                            <FaFilter className="size-4" /> Filter
                        </Button>
                    }
                    <Button onClick={() => exportToExcel()} className="gap-x-2 text-white dark:text-primary-foreground">
                        <PiMicrosoftExcelLogoFill className="size-4" /> Export
                    </Button>
                </div>
            </div>
            {loading ? (
                <div className="min-h-[60dvh] flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {isRefetching && <div className="flex items-center gap-x-2 justify-center">
                        <LoadingSpinner />
                        <span className="text-xs text-foreground/70">refreshing report</span>
                    </div>}
                    <Table ref={reportRef} className="">
                        {reports.map((userReport) => (
                            <UserReportTable
                                eventId={eventId}
                                key={userReport.user.id}
                                UserReport={userReport}
                            />
                        ))}
                    </Table>
                </>
            )}
        </div>
    );
};

export default ReportHome;
