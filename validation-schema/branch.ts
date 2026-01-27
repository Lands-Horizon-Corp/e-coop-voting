import z from "zod";

export const branchIdSchema = z.coerce.number({ required_error : "branch id is required", invalid_type_error : "invalid branch id"});

export const createBranchSchema = z.object({
    branchName: z
        .string({ required_error: "branch name is required" })
        .min(1, "branch name is required"),
    branchDescription: z
        .string({ required_error: "branch description is required" })
        .min(1, "branch description is required"),
    branchAddress: z
        .string({ required_error: "branch address is required" })
        .min(1, "branch address is required"),
    branchPicture: z
        .string({ required_error: "branch picture is required" })
        .optional(),
    coopId : z.coerce.number({ required_error : "Coop id is required", invalid_type_error :  "Invalid coop id"})
});

export const updateBranchSchema = createBranchSchema;
