import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import {
    TElectionWithEvent,
    TElectionWithEventWithPositionAndCandidates,
} from "@/types";

export const useElection = ({
    eventId,
    showErrorMessage = false,
}: {
    eventId: number;
    showErrorMessage?: boolean;
}) => {
    return useQuery<TElectionWithEvent, string>({
        queryKey: [`public-election-${eventId}`],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/public/event/${eventId}/election`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                if (showErrorMessage) toast.error(errorMessage);
                throw errorMessage;
            }
        },
        enabled: eventId !== null && eventId !== undefined,
        refetchInterval: 2 * 60 * 1000,
        retry: 1,
    });
};

export const useElectionWithEventAndPositionsAndCandidates = (
    eventId: number
) => {
    const {
        data: election,
        refetch,
        isFetching,
        isLoading,
    } = useQuery<TElectionWithEventWithPositionAndCandidates, string>({
        queryKey: [`public-election-with-pos-candidate-${eventId}`],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/public/event/${eventId}/election/election-and-positions`
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
        refetchInterval: 2 * 60 * 1000,
    });

    return { election, isFetching, isLoading };
};
