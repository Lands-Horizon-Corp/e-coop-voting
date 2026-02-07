import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SettingsType } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";

type TParams = {
    params: { id: number; electionId: number };
};

export const useUpdateElectionSettings = ({ params }: TParams) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const udateSettingsMutation = useMutation<
        SettingsType,
        number,
        { data: SettingsType }
    >({
        mutationKey: ["update-settings"],
        mutationFn: async ({ data }) => {
            try {
                const eventId = Number(params.id);
                const electionId = Number(params.electionId);
                const response = await axios.patch(
                    `/api/v1/admin/event/${eventId}/election/${electionId}`,
                    data
                );
                toast.success("Election updated successfully");
                queryClient.invalidateQueries({
                    queryKey: ["get-election-query"],
                });
                router.refresh();
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => udateSettingsMutation.mutate({ data }),
                    },
                });
                throw errorMessage;
            }
        },
    });
    return udateSettingsMutation;
};
