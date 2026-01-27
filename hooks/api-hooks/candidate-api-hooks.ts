import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleAxiosErrorMessage } from "@/utils";
import axios from "axios";
import { mutationErrorHandler } from "@/errors/mutation-error-handler";
import { TCandidatewithPosition, TCreateCandidate, TUpdatePosition } from "@/types";
type TParams = {
   params:{id:number,electionId:number,candidateId?:number}
}
export const deleteCandidate = ({params}:TParams) => {
   const queryClient = useQueryClient();
   const deleteCandidateMutation = useMutation<any, string, number>({
      mutationKey: ["delete-candidate-key"],
      mutationFn: async (candidateId) => {
         try {
            const deleted = await axios.delete(`/api/v1/admin/event/${params.id}/election/${params.electionId}/candidate/${candidateId}`);
            return deleted.data;
         } catch (e) {
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => deleteCandidateMutation.mutate(candidateId),
               },
            });
            throw errorMessage;
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-election-query"] });
         toast.success("candidate deleted successfully");
      },
   });
   return deleteCandidateMutation;
};

type Props = {
   onCancelandReset: () => void;
   params:{id:number,electionId:number}
};

export const useCreateCandidate = ({ onCancelandReset,params }: Props) => {
   const queryClient = useQueryClient();
   const createCandidateMutation = useMutation<TCreateCandidate, string, unknown>({
      mutationKey: ["create-candidate-query"],
      mutationFn: async (data) => {
         try {
             const response = await axios.post(`/api/v1/admin/event/${params.id}/election/${params.electionId}/candidate/`, data);
             return response.data;
         } catch (e) {
            console.log(e)
            const errorMessage = handleAxiosErrorMessage(e);
            toast.error(errorMessage, {
               action: {
                  label: "try agian",
                  onClick: () => createCandidateMutation.mutate(data),
               },
            });
            throw errorMessage;
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-election-query"] });
         queryClient.invalidateQueries({ queryKey: ["membersOnCandidate-list-query"] });
         onCancelandReset();
         toast.success("candidate created successfully");
      },
   });
   return {createCandidate: createCandidateMutation.mutate, isSuccess: createCandidateMutation.isSuccess, isPending:createCandidateMutation.isPending}
};


type UpdateCandidateProps = {
   onCancelandReset: () => void;
}

export const useUpdateCandidate =({onCancelandReset}:UpdateCandidateProps,{params}:TParams)=>{
   const queryClient = useQueryClient();
   const updateCandidate = useMutation<TUpdatePosition, string, unknown>({
      mutationKey: ["update-candidate-key"],
      mutationFn: async (positionData) => {
         try {
            const response = await axios.patch(`/api/v1/admin/event/${params.id}/election/${params.electionId}/candidate/${params.candidateId}`, positionData);
            return response.data;
         } catch (e) {
            mutationErrorHandler(e);
         }
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-election-query"] });
         onCancelandReset();
         toast.success("candidate updated successfully");
      },
   });

   return updateCandidate
}


