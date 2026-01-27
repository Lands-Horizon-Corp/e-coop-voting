import z from "zod"
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TUser, TUserWBranchCoop, TUserWithBranch } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { createUserSchema, updateUserSchema } from "@/validation-schema/user";

export const userQuery = ( userId : number ) => {
    const branchListQuery = useQuery<TUserWithBranch, string>({
        queryKey: [`query-user-${userId}`],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/v1/admin/user/${userId}`);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => branchListQuery.refetch()
                    }
                });
                throw handleAxiosErrorMessage(e);
            }
        }
    });
    return branchListQuery;
}

export const userList = () => {
    const branchListQuery = useQuery<TUserWBranchCoop[], string>({
        queryKey: ["user-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get("/api/v1/admin/user");
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => branchListQuery.refetch()
                    }
                });
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });

    return branchListQuery;
}

export const createUser = ( onCreate : (newUser : TUser) => void ) => {
    const queryClient = useQueryClient();
    const createOperation = useMutation<TUser, string, z.infer<typeof createUserSchema>>({
        mutationKey: ["create-user"],
        mutationFn: async (data) => {
            try {
                const response = await axios.post("/api/v1/admin/user", { data });
                queryClient.invalidateQueries({ queryKey: ["user-list-query"] });
                toast.success("User created successfully")
                onCreate(response.data)
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => createOperation.mutate(data)
                    }
                });
                throw handleAxiosErrorMessage(e);
            }
        },
    });

    return createOperation;
}

export const updateUser = ( userId : number, onUpdate : (updatedUser : TUser) => void ) => {
    const queryClient = useQueryClient();
    const updateOperation = useMutation<TUser, string, z.infer<typeof updateUserSchema>>({
        mutationKey: ["update-user"],
        mutationFn: async (data) => {
            try {
                const response = await axios.patch(`/api/v1/admin/user/${userId}`, { data });
                queryClient.invalidateQueries({ queryKey: ["user-list-query"] });
                toast.success("User updated successfully")
                onUpdate(response.data)
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => updateOperation.mutate(data)
                    }
                });
                throw handleAxiosErrorMessage(e);
            }
        },
    });

    return updateOperation;
}

export const deleteUser = () => {
    const queryClient = useQueryClient();
    const deleteOperation = useMutation<any, string, number>({
        mutationKey : ["delete-user"],
        mutationFn : async (userId) => {
            try{
                const deleted = await axios.delete(`/api/v1/admin/user/${userId}`);
                toast.success("User deleted successfully");
                queryClient.invalidateQueries({ queryKey: ["user-list-query"] })
                return deleted.data;
            }catch(e){
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => deleteOperation.mutate(userId)
                    }
                });
                throw errorMessage
            }
        }
    })

    return deleteOperation;
}

export const eventBasedUserList = (eventId : number) => {
    const branchListQuery = useQuery<TUserWBranchCoop[], string>({
        queryKey: ["user-list-query"],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/v1/admin/event/${eventId}/event-users`);
                return response.data;
            } catch (e) {
                const errorMessage = handleAxiosErrorMessage(e);
                toast.error(errorMessage, {
                    action : {
                        label : "try agian",
                        onClick : () => branchListQuery.refetch()
                    }
                });
                throw handleAxiosErrorMessage(e);
            }
        },
        initialData: [],
    });

    return branchListQuery;
}
