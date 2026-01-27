"use client";
import React from "react";
import { toast } from "sonner";
import { Sigma } from "lucide-react";
import { IoIosPower as PowerIcon } from "react-icons/io";

import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import LoadingSpinner from "@/components/loading-spinner";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import {
    useGetEventById,
    useUpdateEventRegistrationStatus,
} from "@/hooks/api-hooks/use-events";
import { useAttendanceStats } from "@/hooks/api-hooks/attendance-api-hooks";

interface Props {
    eventId: number;
}

const AttendanceQuorum = ({ eventId }: Props) => {
    const { data: event, isFetching } = useGetEventById({ eventId });

    const { mutate: toggleRegistrationOpen, isPending } =
        useUpdateEventRegistrationStatus({
            eventId,
            onSuccess: () =>
                toast.success("Event registration status was updated."),
            onError: () => toast.success("Failed to update event status"),
        });

    const { data: attendanceStats } = useAttendanceStats({
        eventId,
        onError: () => toast.error("Failed to load event stats"),
    });

    return (
        <Card className="w-full shrink-0 min-w-[400px] md:max-w-xl flex-auto relative">
            <div className="flex p-4 space-x-2  items-center py-2">
                <div className="p-1 dark:bg-[#c5a522] bg-[#e7c127] rounded-sm">
                    <Sigma className="size-5 text-slate-200" />
                </div>
                <h1 className="font-medium">Quorum</h1>
            </div>
            <ActionTooltip
                content={
                    event?.isRegistrationOpen
                        ? "End Registration"
                        : "Reopen Registration"
                }
            >
                <Button
                    size="sm"
                    variant={
                        event?.isRegistrationOpen ? "secondary" : "destructive"
                    }
                    onClick={() =>
                        toggleRegistrationOpen({
                            isRegistrationOpen: !event?.isRegistrationOpen,
                        })
                    }
                    className={cn(
                        "size-fit p-2 border absolute font-normal group right-2 rounded-xl top-2",
                        event?.isRegistrationOpen
                            ? "text-primary hover:bg-primary/10 hover:text-primary"
                            : "text-destructive-foreground bg-destructive/30 hover:bg-destructive/40"
                    )}
                >
                    <PowerIcon
                        className={cn(
                            "size-4 mr-2 text-foreground",
                            event?.isRegistrationOpen
                                ? "animate-pulse text-primary"
                                : "text-muted-foreground/40 group-hover:text-destructive-foreground"
                        )}
                    />
                    {isFetching || isPending ? (
                        <LoadingSpinner />
                    ) : event?.isRegistrationOpen ? (
                        "End Registration"
                    ) : (
                        "Open Registration"
                    )}
                </Button>
            </ActionTooltip>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-x-4">
                    <h1>Total Attendance</h1>
                    <h1 className="font-bold text-xl xl:text-3xl text-primary">
                        {attendanceStats.totalAttendees > 0
                            ? (
                                  (attendanceStats.totalIsRegistered /
                                      attendanceStats.totalAttendees) *
                                  100
                              ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })
                            : "0"}{" "}
                        %
                    </h1>
                </div>

                <CardDescription className="text-md">
                    {attendanceStats.totalIsRegistered + " (Total registered)"}
                    {" / "}
                    {attendanceStats.totalAttendees + " members"}
                </CardDescription>
            </CardContent>
        </Card>
    );
};

export default AttendanceQuorum;
