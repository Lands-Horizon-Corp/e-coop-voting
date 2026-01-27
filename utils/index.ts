import axios from "axios";
import { TApiError } from "@/types";

const isTApiError = (data: any): data is TApiError => {
   return data && typeof data.message === "string";
};

export const handleAxiosErrorMessage = (error: unknown) => {
   if (!axios.isAxiosError(error)) {
      return "Unknown error";
   }

   if (!error.response) {
      return error.message;
   }

   if (!isTApiError(error.response.data)) {
      return error.message;
   }

   return error.response.data.message;
};

