import { handleAxiosErrorMessage } from "@/utils";
import { toast } from "sonner";

export const mutationErrorHandler=(e:unknown)=>{
     let errorMessage = "";
                
     if (e instanceof Error) errorMessage = e.message;
     else errorMessage =  handleAxiosErrorMessage(e);

     toast.error(errorMessage);
     throw errorMessage
}