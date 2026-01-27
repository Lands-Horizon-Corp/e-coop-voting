import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { handleAxiosErrorMessage } from "@/utils";
import {
    TMemberAttendanceStats,
    TMemberAttendeesWithRegistrationAssistance,
} from "@/types";
import { IQueryHook } from "./types";
import { adminRegisterMemberSchema } from "@/validation-schema/event";

export const useAttendanceRegistration = (eventId: number | string) => {
    const queryClient = useQueryClient();
    return useMutation<any, string, z.infer<typeof adminRegisterMemberSchema>>({
        mutationKey: [`attendance-registration`],
        mutationFn: async (data) => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/attendance-registration`,
                    data
                );
                toast.success(`Member ${data.operation}`);
                queryClient.invalidateQueries({
                    queryKey: ["all-attendance-list-query"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["all-event-members-list-query"],
                });
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });
};

export const useAttendanceList = ({
    eventId,
    onSuccess,
    onError,
    ...other
}: { eventId: number } & IQueryHook) => {
    return useQuery<TMemberAttendeesWithRegistrationAssistance[], string>({
        queryKey: ["all-attendance-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `/api/v1/admin/event/${eventId}/member/attendance`
                );
                onSuccess?.(response.data);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                onError?.(errorMessage);
                throw errorMessage;
            }
        },
        initialData: [],
        ...other,
    });
};

export const useAttendanceStats = ({
    eventId,
    onSuccess,
    onError,
    ...other
}: { eventId: number } & IQueryHook) => {
    return useQuery<TMemberAttendanceStats>({
        queryKey: ["attendance", eventId, "stats"],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `/api/v1/admin/event/${eventId}/member/attendance/stats`
                );

                onSuccess?.(response.data);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                onError?.(errorMessage);
                throw errorMessage;
            }
        },
        initialData: {
            totalAttendees: 0,
            totalIsRegistered: 0,
        },
        refetchInterval: 5 * 1000,
    });
};
