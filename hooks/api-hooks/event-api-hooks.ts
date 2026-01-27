import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import {
    TEventWithElection,
    TEventWithElectionWithCoopWithBranch,
} from "@/types";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import { useRouter } from "next/navigation";

export const deleteEvent = () => {
    const queryClient = useQueryClient();
    const deleteEventMutation = useMutation<any, string, number>({
        mutationKey: ["delete-event"],
        mutationFn: async (eventId) => {
            try {
                const deleted = await axios.delete(
                    `/api/v1/admin/event/${eventId}`
                );
                toast.success("Event deleted successfully");
                queryClient.invalidateQueries({
                    queryKey: ["event-list-query"],
                });
                return deleted.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => deleteEventMutation.mutate(eventId),
                    },
                });
                throw errorMessage;
            }
        },
    });
    return deleteEventMutation;
};

export const useGetAllEvent = () => {
    const useGetAllEvent = useQuery<
        TEventWithElectionWithCoopWithBranch[],
        string
    >({
        queryKey: ["event-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get("/api/v1/admin/event");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => useGetAllEvent.refetch(),
                    },
                });
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });

    return useGetAllEvent;
};

type Props = {
    onCancelandReset: () => void;
    id?: number;
};

export const useCreateEvent = ({ onCancelandReset }: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const createEvent = useMutation<TEventWithElection, string, any>({
        mutationKey: ["create-event"],
        mutationFn: async (data) => {
            try {
                const response = await axios.post("/api/v1/admin/event", {
                    data,
                });
                return response.data;
            } catch (e) {
                mutationErrorHandler(e);
            }
        },
        onSuccess: (data: TEventWithElection) => {
            queryClient.invalidateQueries({ queryKey: ["event-list-query"] });
            onCancelandReset();
            toast.success("Event created successfully");
            if (!data.election) return;
            router.push(
                `/admin/events/${data.id}/election/${data.election.id}/overview`
            );
        },
    });

    return createEvent;
};
