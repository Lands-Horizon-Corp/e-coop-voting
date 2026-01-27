import { TElection, TElectionWithPositionsAndCandidates } from "@/types";
import { handleAxiosErrorMessage } from "@/utils";
import { ElectionStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type TParams ={
   params:{id?:number,electionId?:number}
}
export const getElection = (id:number) => {
     const {data, isLoading,error } = useQuery<TElection>({
         queryKey: ["election-query"],
         queryFn: async () => {
            try {
               const response = await axios.get(`/api/v1/admin/event/${id}`);
               return response.data;
            } catch (e) {
               const errorMessage = handleAxiosErrorMessage(e);
               throw errorMessage;
            }
         },
      });
      return { elections: data, isLoading, error };
};

export const hasElection = (id:number) => {
   const electionId = Number(id)
   const {data, isLoading,error }= useQuery<TElection>({
       queryKey: ["election-list-query"],
       queryFn: async () => {
          try {
             const response = await axios.get(`/api/v1/election/${electionId}`);
             return response.data;
          } catch (e) {
             const errorMessage = handleAxiosErrorMessage(e);
             throw errorMessage;
          }
       },
    });
    return { elections: data ?? [], isLoading, error };
};

export const  promptElectionStatus = ({params}:TParams) =>{
   const router = useRouter()
   const queryClient = useQueryClient()
   const promptElection = useMutation<ElectionStatus,any,{status:ElectionStatus}>({
      mutationKey:["election-prompt-key"],
      mutationFn:async({status})=>{
         try { 
            const electionId = Number(params.electionId)
             const response = await axios.patch(`/api/v1/admin/event/${params.id}/election/${electionId}/switch`,{
            status:status
            })
           toast.success(`The Election is already  ${status === "live" ? "Live! 🎉":"End"}`);
           queryClient.invalidateQueries({queryKey: ["get-election-query"],});
           router.refresh();
           return response.data 
         } catch (e) {
            throw handleAxiosErrorMessage(e);
         }
      }
   })
   return promptElection
}

export const getElectionWithPositionAndCandidates = ({params}:TParams) => {
    const { data, isLoading, error, refetch} = useQuery<TElectionWithPositionsAndCandidates, any>({
      queryKey: ["get-election-query", params?.id, params?.electionId],
      enabled: !!params,
       queryFn: async () => {
          try {
             const response = await axios.get(`/api/v1/admin/event/${params.id}/election/${params.electionId}`);
             return response.data;
          } catch (e) {
             const errorMessage = handleAxiosErrorMessage(e);
             throw errorMessage;
          }
       },
    });
    return { elections: data , isLoading, error, refetch };
};






