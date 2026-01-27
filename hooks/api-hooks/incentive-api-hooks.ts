import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    TIncentiveAssigned,
    TIncentiveClaimsWithIncentiveAttendeeAssistedBy,
    TIncentiveClaimsWithIncentiveAndClaimAssistance,
    TIncentiveWithClaimAndAssignedCount,
    TListOfAssigneesWithAssistCount,
    TUserWithAssignedIncentives,
} from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import {
    claimReleaseSchema,
    createAssistedClaimSchema,
    createIncentiveAssigneeSchema,
    updateIncentiveAssignedSchema,
} from "@/validation-schema/incentive";
import { TIncentiveAssignedToMe } from "@/types/incentive-assigned.types";
import { IQueryHook } from "./types";

export const useINcentiveeList = ({
    eventId,
    onSuccess,
    onError,
    ...other
}: { eventId: number } & IQueryHook) => {
    return useQuery<TIncentiveWithClaimAndAssignedCount[]>({
        queryKey: ["incentive-withclaimcount-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/incentives`
                );
                onSuccess?.(request.data);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                onError?.(errorMessage);
                throw e;
            }
        },
        initialData: [],
    });
};

export const useDeleteIncentive = (eventId: number, incentiveId: number) => {
    const queryClient = useQueryClient();

    const { mutate: deleteIncentive, isPending } = useMutation<any, string>({
        mutationKey: ["delete-incentive"],
        mutationFn: async (data) => {
            try {
                const response = await axios.delete(
                    `/api/v1/admin/event/${eventId}/incentives/${incentiveId}`,
                    { data }
                );

                queryClient.invalidateQueries({
                    queryKey: ["incentive-withclaimcount-list"],
                });

                toast.success("Incentive has been deleted.");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { deleteIncentive, isPending };
};

export const useIncentiveListAssignee = ({
    eventId,
    onSuccess,
    onError,
    ...other
}: { eventId: number } & IQueryHook) => {
    return useQuery<TListOfAssigneesWithAssistCount[], string>({
        queryKey: ["incentive-assignee-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/incentives/assignees`
                );
                onSuccess?.(request.data);
                return request.data;
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

export const userWithAssignedIncentives = (eventId: number) => {
    const {
        data: usersWithAssigned,
        isFetching: isFetchingUser,
        isLoading: isLoadingUser,
        isError,
        error,
    } = useQuery<TUserWithAssignedIncentives[]>({
        queryKey: ["incentive-user-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/incentives/user-with-assigned`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw e;
            }
        },
        initialData: [],
    });

    return { usersWithAssigned, isFetchingUser, isLoadingUser, isError, error };
};

export const useCreateAssignIncentive = (
    eventId: number,
    incentiveId: number,
    onCreate?: (created: TIncentiveAssigned) => void
) => {
    const queryClient = useQueryClient();

    const {
        data: created,
        mutate: createAssignee,
        isPending: isCreatingAssignee,
        isError,
        error,
    } = useMutation<
        TIncentiveAssigned,
        string,
        z.infer<typeof createIncentiveAssigneeSchema>
    >({
        mutationKey: ["create-assign-incentive"],
        mutationFn: async (data) => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/incentives/${incentiveId}/assign`,
                    data
                );
                if (onCreate) onCreate(request.data);

                queryClient.invalidateQueries({
                    queryKey: ["incentive-withclaimcount-list"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["incentive-assignee-list"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["incentive-user-list"],
                });

                toast.success("User Assigned!");

                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { created, createAssignee, isCreatingAssignee, isError, error };
};

export const useRevokeAssignIncentive = (
    eventId: number,
    incentiveId: number,
    assignId: number
) => {
    const queryClient = useQueryClient();

    const { mutate: deleteAssignee, isPending: isDeleting } = useMutation<
        string,
        string
    >({
        mutationKey: ["delete-incentive-assigned"],
        mutationFn: async () => {
            try {
                const response = await axios.delete(
                    `/api/v1/admin/event/${eventId}/incentives/${incentiveId}/assign/${assignId}`
                );

                queryClient.invalidateQueries({
                    queryKey: ["incentive-withclaimcount-list"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["incentive-assignee-list"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["incentive-user-list"],
                });

                toast.success("User revoked");

                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { deleteAssignee, isDeleting };
};

export const updateAssignedQuantity = (
    eventId: number,
    incentiveId: number,
    assignId: number,
    onUpdate?: () => void
) => {
    const queryClient = useQueryClient();

    const { mutate: updateAssigned, isPending: isUpdating } = useMutation<
        string,
        string,
        z.infer<typeof updateIncentiveAssignedSchema>
    >({
        mutationKey: ["update-incentive-assigned-qty"],
        mutationFn: async (data) => {
            try {
                const response = await axios.patch(
                    `/api/v1/admin/event/${eventId}/incentives/${incentiveId}/assign/${assignId}`,
                    data
                );

                queryClient.invalidateQueries({
                    queryKey: ["incentive-withclaimcount-list"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["incentive-assignee-list"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["incentive-user-list"],
                });

                toast.success("Assigned quantity updated");

                if (onUpdate) onUpdate();

                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { updateAssigned, isUpdating };
};

export const useAssignedIncentiveToMe = (eventId: number, enabled: boolean) => {
    return useQuery<
        TIncentiveAssignedToMe[],
        string
    >({
        queryKey: ["incentive-assigned-to-me-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/incentives/assigned-to-me`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData: [],
        enabled,
    });
};

export const useMemberClaimsWithAssistanceList = (
    eventId: number,
    memberId: string,
    enabled: boolean
) => {
    return useQuery<TIncentiveClaimsWithIncentiveAndClaimAssistance[], string>({
        queryKey: [`incentive-claims-member-${memberId}`],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/member/${memberId}/claims`
                );
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
        initialData: [],
        enabled,
    });
};

export const useCreateClaimAssistance = (
    eventId: number,
    onCreate: () => void
) => {
    return useMutation<any, string, z.infer<typeof createAssistedClaimSchema>>({
        mutationKey: ["create-assist-claim"],
        mutationFn: async (data) => {
            try {
                const request = await axios.post(
                    `/api/v1/admin/event/${eventId}/incentives/claim`,
                    data
                );
                toast.success("Claim saved!");
                onCreate();
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });
};

export const useClaimsMasterList = ({
    eventId,
    onSuccess,
    onError,
    ...other
}: IQueryHook & { eventId: number }) => {
    return useQuery<TIncentiveClaimsWithIncentiveAttendeeAssistedBy[], string>({
        queryKey: ["claims-master-list"],
        queryFn: async () => {
            try {
                const request = await axios.get(
                    `/api/v1/admin/event/${eventId}/incentives/claim`
                );
                onSuccess?.(request.data);
                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                onError?.(errorMessage);
                throw errorMessage;
            }
        },
        initialData: [],
        ...other,
    });
};

export const useClaimDelete = (eventId: number, onDelete?: () => void) => {
    const queryClient = useQueryClient();
    const {
        data: deletedClaim,
        mutate: deleteClaim,
        isPending: isDeletingClaim,
    } = useMutation<any, string, number>({
        mutationKey: ["delete-claim"],
        mutationFn: async (claimId) => {
            try {
                const request = await axios.delete(
                    `/api/v1/admin/event/${eventId}/incentives/claim/${claimId}`
                );
                toast.success("Claim Deleted");

                if (onDelete) onDelete();

                queryClient.invalidateQueries({
                    queryKey: ["claims-master-list"],
                });

                return request.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { deletedClaim, deleteClaim, isDeletingClaim };
};

export const useClaimRelease = (eventId: number, claimId: number) => {
    const queryClient = useQueryClient();

    const { mutate: releaseClaim, isPending: isReleasing } = useMutation<
        any,
        string,
        z.infer<typeof claimReleaseSchema>
    >({
        mutationKey: ["release-claim"],
        mutationFn: async (payload) => {
            try {
                const request = await axios.patch(
                    `/api/v1/admin/event/${eventId}/incentives/claim/${claimId}`,
                    payload
                );
                toast.success("Claim released successfully");
                queryClient.invalidateQueries({
                    queryKey: ["claims-master-list"],
                });
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { releaseClaim, isReleasing };
};
