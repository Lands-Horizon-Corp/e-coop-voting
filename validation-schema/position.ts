import { z } from "zod";

export const createPositionSchema = z.object({
   positionName: z
      .string({
         required_error: "position name is required",
         invalid_type_error: "position name must be string",
      })
      .min(1, "position name is required"),
   numberOfSelection: z.coerce
      .number({
         required_error: "number of seats is required",
         invalid_type_error: "position number of seats must be number",
      })
      .refine(
         (val) => val >= 1,
         (val) => ({ message: `value must be greater than or equal to 1` })
      ),
   electionId: z.coerce.number({
      required_error: "position election ID is required",
      invalid_type_error: "position election ID must be number",
   }),
});


export const updatePositionSchema = z.object({
   positionName: z
      .string({
         required_error: "position name is required",
         invalid_type_error: "position name must be string",
      })
      .min(1, "position name is required"),
   numberOfSelection: z.coerce
      .number({
         required_error: "number of seats is required",
         invalid_type_error: "position number of seats must be number",
      })
      .refine(
         (val) => val >= 1,
         () => ({ message: `value must be greater than or equal to 1` })
      ),
   electionId: z.coerce.number({
      required_error: "position election ID is required",
      invalid_type_error: "position election ID must be number",
   }),
});
