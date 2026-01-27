import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { TEvent, TEventWithElection } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { IQueryHook } from "../api-hooks/types";

export const useEventList = () => {
    return useQuery<TEvent[], string>({
        queryKey: ["public-event-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(`/api/v1/public/event`);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                throw errorMessage;
            }
        },
        initialData: [],
        refetchInterval: 2 * 60 * 1000,
    });
};

export const useEvent = (eventId: number, interval: number = 2 * 60 * 1000) => {
    const {
        data: event,
        refetch,
        isFetching,
        isLoading,
    } = useQuery<TEventWithElection, string>({
        queryKey: [`public-event-${eventId}`],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/public/event/${eventId}`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: { label: "try again", onClick: () => refetch() },
                });
                throw errorMessage;
            }
        },
        refetchInterval: interval,
    });

    return { event, isFetching, isLoading };
};

export const usePublicGetEventById = ({
    eventId,
    onSuccess,
    onError,
    ...other
}: { eventId: number } & IQueryHook<TEvent, string>) => {
    const {
        data: existingSettings,
        isLoading,
        isRefetching,
    } = useQuery<TEvent, string>({
        queryKey: [`event-${eventId}-settings-public`],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/public/event/${eventId}/settings`
                );
                onSuccess?.(request.data);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                onError?.(errorMessage);
                throw errorMessage;
            }
        },
        initialData: {
            id: eventId,
            registrationOnEvent: true,
            defaultMemberSearchMode: "ByPassbook",
        } as TEvent,
        refetchOnWindowFocus: false,
        ...other,
    });

    return { existingSettings, isLoading, isRefetching };
};
