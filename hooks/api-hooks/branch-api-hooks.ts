import z from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TBranch, TBranchWCoop } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import { createBranchSchema } from "@/validation-schema/branch";
import { Role } from "@prisma/client";
import { user } from "next-auth";

export const deleteBranch = () => {
    const queryClient = useQueryClient();
    const deleteOperation = useMutation<any, string, number>({
        mutationKey: ["delete-branch"],
        mutationFn: async (branchId) => {
            try {
                const deleted = await axios.delete(
                    `/api/v1/admin/branch/${branchId}`
                );
                toast.success("Branch deleted successfully");
                queryClient.invalidateQueries({
                    queryKey: ["branch-list-query"],
                });
                return deleted.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => deleteOperation.mutate(branchId),
                    },
                });
                throw errorMessage;
            }
        },
    });

    return deleteOperation;
};

export const branchList = (user?: user) => {
    const branchListQuery = useQuery<TBranchWCoop[], string>({
        queryKey: ["branch-list-query"],
        queryFn: async () => {
            try {
                const id = Number(user?.coopId);
                if (user?.role === Role.coop_root) {
                    const response = await axios.get(
                        `/api/v1/admin/branch/${id}`
                    );
                    return response.data;
                }
                const response = await axios.get("/api/v1/admin/branch");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action: {
                        label: "try agian",
                        onClick: () => branchListQuery.refetch(),
                    },
                });
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });

    return branchListQuery;
};

type TUpdateBranch = z.infer<typeof createBranchSchema>;
type TCreateBranch = TUpdateBranch;

export const createBranch = (onCreate?: (branch: TBranch) => void) => {
    const queryClient = useQueryClient();
    const {
        data: createdBranch,
        mutate: saveBranch,
        isPending: isCreatingBranch,
    } = useMutation<TBranch, string, TCreateBranch>({
        mutationKey: ["create-branch"],
        mutationFn: async (data) => {
            try {
                const response = await axios.post("/api/v1/admin/branch", {
                    data,
                });

                queryClient.invalidateQueries({
                    queryKey: ["branch-list-query"],
                });
                if (onCreate) onCreate(response.data);

                toast.success("Branch created successfully");
                return response.data;
            } catch (e) {
                let errorMessage = "";

                if (e instanceof Error) errorMessage = e.message;
                else errorMessage = handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return { createdBranch, saveBranch, isCreatingBranch };
};

export const updateBranch = ({
    branchId,
    onUpdate,
}: {
    branchId: number;
    onUpdate: (newBranch: TBranch) => void;
}) => {
    const queryClient = useQueryClient();
    const update = useMutation<TBranch, string, TUpdateBranch>({
        mutationKey: ["update-branch"],
        mutationFn: async (data) => {
            try {
                const response = await axios.patch(
                    `/api/v1/admin/branch/${branchId}`,
                    {
                        data,
                    }
                );

                queryClient.invalidateQueries({
                    queryKey: ["branch-list-query"],
                });

                onUpdate(response.data);

                return response.data;
            } catch (e) {
                let errorMessage = "";

                if (e instanceof Error) errorMessage = e.message;
                else errorMessage = handleAxiosErrorMessage(e);

                toast.error(errorMessage);
                throw errorMessage;
            }
        },
    });

    return update;
};
