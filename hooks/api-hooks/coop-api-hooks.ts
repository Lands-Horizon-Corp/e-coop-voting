import z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { TCoopWBranch } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { createCoopSchema, updateCoopSchema } from "@/validation-schema/coop";

export const useCoopList = () => {
  const {
    data: coopList,
    isLoading,
    refetch,
    isFetching,
    isError,
  } = useQuery<TCoopWBranch[], string>({
    queryKey: ["coop-list-query"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/v1/admin/coop");
        return response.data;
      } catch (e) {
        const errorMessage = handleAxiosErrorMessage(e);
        toast.error(errorMessage, {
          action: {
            label: "try agian",
            onClick: () => refetch(),
          },
        });
        throw handleAxiosErrorMessage(e);
      }
    },
    initialData: [],
  });

  return { coopList, isLoading, refetch, isFetching, isError };
};

type TCreateCoopType = z.infer<typeof createCoopSchema>;

export const useCreateCoop = (onCreate?: (newCoop: TCoopWBranch) => void) => {
  const queryClient = useQueryClient();
  const {
    data: newCoop,
    mutate: createCoop,
    isPending: isCreating,
  } = useMutation<
    TCoopWBranch,
    string,
    { data: TCreateCoopType; image?: File | null }
  >({
    mutationKey: ["create-coop-mutation"],
    mutationFn: async ({ data, image }) => {
      try {

        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        if(image) formData.append("image", image, image.name);

        const request = await axios.postForm("/api/v1/admin/coop", formData);

        if (onCreate) onCreate(request.data);

        queryClient.invalidateQueries({ queryKey: ["coop-list-query"] });
        return request.data;
      } catch (e) {
        const errorMessage = handleAxiosErrorMessage(e);
        toast.error(errorMessage, {
          action: {
            label: "try agian",
            onClick: () => createCoop({ data, image }),
          },
        });
        throw handleAxiosErrorMessage(e);
      }
    },
  });

  return { newCoop, createCoop, isCreating };
};


type TUpdateCoopType = z.infer<typeof updateCoopSchema>;

export const useUpdateCoop = (coopId : number, onUpdate ?: (updatedCoop : TCoopWBranch) => void) => {
  const queryClient = useQueryClient();
  const {
    data: updatedCoop,
    mutate: updateCoop,
    isPending: isUpdatingCoop,
  } = useMutation<
    TCoopWBranch,
    string,
    { data: TUpdateCoopType; image?: File | null }
  >({
    mutationKey: ["update-coop-mutation"],
    mutationFn: async ({ data, image }) => {
      try {

        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        if(image) formData.append("image", image, image.name);

        const request = await axios.patchForm(`/api/v1/admin/coop/${coopId}`, formData);

        if (onUpdate) onUpdate(request.data);

        queryClient.invalidateQueries({ queryKey: ["coop-list-query"] });
        return request.data;
      } catch (e) {
        const errorMessage = handleAxiosErrorMessage(e);
        toast.error(errorMessage, {
          action: {
            label: "try agian",
            onClick: () => updateCoop({ data, image }),
          },
        });
        throw handleAxiosErrorMessage(e);
      }
    },
  });

  return { updatedCoop, updateCoop, isUpdatingCoop };
};

export const useDeleteCoop = (onDelete?: () => void) => {
  const queryClient = useQueryClient();
  const {
    data,
    mutate: deleteCoop,
    isPending: isDeletingCoop,
  } = useMutation<
    string,
    string,
    number
  >({
    mutationKey: ["delete-coop-mutation"],
    mutationFn: async (coopId) => {
      try {

        const request = await axios.delete(`/api/v1/admin/coop/${coopId}` );

        if (onDelete) onDelete();

        queryClient.invalidateQueries({ queryKey: ["coop-list-query"] });
        return request.data;
      } catch (e) {
        const errorMessage = handleAxiosErrorMessage(e);
        toast.error(errorMessage, {
          action: {
            label: "try agian",
            onClick: () => deleteCoop(coopId) 
          },
        });
        throw handleAxiosErrorMessage(e);
      }
    },
  });

  return { data, deleteCoop, isDeletingCoop };
};
