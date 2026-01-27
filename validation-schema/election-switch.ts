import { ElectionStatus } from "@prisma/client";
import { z } from "zod";

export const electionSwitchSchema = z.nativeEnum(ElectionStatus,{
      invalid_type_error: "invalid email",
      required_error: "Email is required",
   })
