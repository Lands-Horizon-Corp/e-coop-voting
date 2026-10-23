"use client";
import React from "react";
import { toast } from "sonner";
import { Sigma } from "lucide-react";

import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import LoadingSpinner from "@/components/loading-spinner";

import { cn } from "@/lib/utils";
import {
    useGetEventById,
    useUpdateEventRegistrationStatus,
} from "@/hooks/api-hooks/use-events";
import { useAttendanceStats } from "@/hooks/api-hooks/attendance-api-hooks";
import { user } from "next-auth";

interface Props {
    eventId: number;
    currentUser: user;
}

const AttendanceQuorum = ({ eventId, currentUser }: Props) => {
    const { data: event, isFetching } = useGetEventById({ eventId });

    const { mutate: toggleRegistrationOpen, isPending } =
        useUpdateEventRegistrationStatus({
            eventId,
            onSuccess: () =>
                toast.success("Event registration status was updated."),
            onError: () => toast.error("Failed to update event status"),
        });

    const { data: attendanceStats } = useAttendanceStats({
        eventId,
        onError: () => toast.error("Failed to load event stats"),
    });

    const percent =
        attendanceStats.totalAttendees > 0
            ? (attendanceStats.totalIsRegistered /
                  attendanceStats.totalAttendees) *
              100
            : 0;

    const isOpen = !!event?.isRegistrationOpen;

    return (
        <div className="flex items-center gap-x-4 rounded-xl bg-secondary/40 dark:bg-background/40 p-4">
            <div className="p-2 dark:bg-[#c5a522] bg-[#e7c127] rounded-lg">
                <Sigma className="size-6 text-slate-200" />
            </div>
            <div className="flex flex-col gap-y-2 min-w-[11rem]">
                <div className="flex items-baseline gap-x-3 leading-none">
                    <span className="text-3xl font-bold tabular-nums text-primary">
                        {percent.toLocaleString("en-US", {
                            maximumFractionDigits: 1,
                        })}
                        %
                    </span>
                    <span className="text-sm text-muted-foreground tabular-nums text-nowrap">
                        {attendanceStats.totalIsRegistered} /{" "}
                        {attendanceStats.totalAttendees} members
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out"
                        style={{
                            transform: `scaleX(${Math.min(percent, 100) / 100})`,
                        }}
                    />
                </div>
            </div>
            <ActionTooltip
                content={isOpen ? "End Registration" : "Reopen Registration"}
            >
                <Button
                    disabled={currentUser.role === "staff"}
                    size="sm"
                    variant={isOpen ? "secondary" : "destructive"}
                    onClick={() =>
                        toggleRegistrationOpen({
                            isRegistrationOpen: !event?.isRegistrationOpen,
                        })
                    }
                    className={cn(
                        "h-10 gap-x-2 rounded-full px-4 text-sm font-normal border transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97]",
                        isOpen
                            ? "text-primary hover:bg-primary/10 hover:text-primary"
                            : "text-destructive-foreground bg-destructive/30 hover:bg-destructive/40",
                    )}
                >
                    <span
                        className={cn(
                            "size-2 rounded-full",
                            isOpen ? "bg-primary" : "bg-muted-foreground/50",
                        )}
                    />
                    {isFetching || isPending ? (
                        <LoadingSpinner />
                    ) : isOpen ? (
                        "End Registration"
                    ) : (
                        "Open Registration"
                    )}
                </Button>
            </ActionTooltip>
        </div>
    );
};

export default AttendanceQuorum;
