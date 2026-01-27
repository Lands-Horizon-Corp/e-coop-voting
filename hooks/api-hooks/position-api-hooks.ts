import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import { TCreatePosition, TPosition, TUpdatePosition } from "@/types";

export const deletePosition = (params: { id: number; electionId: number }) => {
    const queryClient = useQueryClient();
    const deletePositionMutation = useMutation<any, string, number>({
        mutationKey: ["delete-position"],
        mutationFn: async (positionId) => {
            try {
                const deleted = await axios.delete(
                    `/api/v1/admin/event/${params.id}/election/${params.electionId}/position/${positionId}`
                );
                return deleted.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () =>
                            deletePositionMutation.mutate(positionId),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-election-query"] });
            toast.success("position deleted successfully");
        },
    });
    return deletePositionMutation;
};
export const getUniquePosition = (params: {
    id: number;
    electionId: number;
    positionId: number;
}) => {
    const { data, isLoading, isError } = useQuery<TPosition>({
        queryKey: ["position-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `/api/v1/admin/event/${params.id}/election/${params.electionId}/position/${params.positionId}`
                );
                return response.data;
            } catch (e) {
                throw handleAxiosErrorMessage(e);
            }
        },
    });
    return { positions: data, isError, isLoading };
};

type Props = {
    onCancelReset: () => void;
    params: { id: number; electionId: number };
};

export const createPosition = ({ onCancelReset, params }: Props) => {
    const queryClient = useQueryClient();
    const createPosition = useMutation<TCreatePosition, string, unknown>({
        mutationKey: ["create-position-key"],
        mutationFn: async (data) => {
            try {
                const response = await axios.post(
                    `/api/v1/admin/event/${params.id}/election/${params.electionId}/position/`,
                    data
                );
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => createPosition.mutate(data),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-election-query"] });
            onCancelReset();
            toast.success("position created successfully");
        },
    });
    return createPosition;
};

type updateProps = {
    onCancelReset: () => void;
    params: { id: number; electionId: number; positionId: number };
};

export const updatePositions = ({ onCancelReset, params }: updateProps) => {
    const queryClient = useQueryClient();

    const updatePosition = useMutation<TUpdatePosition, string, unknown>({
        mutationKey: ["update-position-key"],
        mutationFn: async (positionData) => {
            try {
                const response = await axios.patch(
                    `/api/v1/admin/event/${params.id}/election/${params.electionId}/position/${params.positionId}`,
                    positionData
                );
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => updatePosition.mutate(positionData),
                    },
                });
                throw errorMessage;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-election-query"] });
            onCancelReset();
            toast.success("position updated successfully");
        },
    });
    return updatePosition;
};
