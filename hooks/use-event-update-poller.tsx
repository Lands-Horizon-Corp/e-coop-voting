"use client";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const useEventSubDataUpdateStatus = ({
    eventId,
}: {
    eventId: number | string;
}) => {
    return useQuery<{
        pollerResponse?: { id: number; subUpdatedAt: Date | null };
        result: string;
    }>({
        queryKey: ["poller", "event", eventId],
        queryFn: async () => {
            const res = await axios.get<{
                id: number;
                subUpdatedAt: Date | null;
            }>(`/api/v1/poller/event/${eventId}`);

            if (res.data.subUpdatedAt) {
                return {
                    pollerResponse: res.data,
                    result: format(
                        res.data.subUpdatedAt,
                        "yyyy-MM-dd HH:mm:ss.SSS"
                    ),
                };
            }

            return { pollerResponse: res.data, result: "no-update" };
        },
        initialData: { pollerResponse: undefined, result: "no-update" },
        enabled: eventId !== null || eventId !== undefined,
        refetchInterval: 3000,
    });
};

export const useOnEventSubDataUpdate = ({
    eventId,
    onChange,
}: {
    eventId: number | string;
    onChange?: () => void;
}) => {
    const [prev, setPrev] = useState<string>("no-update");

    const {
        data: { result },
    } = useEventSubDataUpdateStatus({ eventId });

    useEffect(() => {
        if (prev !== result) {
            setPrev(result);
            onChange?.();
        }
    }, [result, onChange, prev]);
};
