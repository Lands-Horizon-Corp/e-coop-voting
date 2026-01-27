import z from "zod";

export const folderGroupSchema = z.enum([
    "user",
    "coop",
    "event",
    "branch",
    "member",
    "downloadables",
    "election-candidates",
]);

export type TFolderGroupSchema = z.infer<typeof folderGroupSchema>;

export const uploadSchema = z.object({
    file: z
        .any()
        .refine(
            (file: File | undefined | null) =>
                file !== undefined && file !== null,
            {
                message: "File is required",
                path: ["file"],
            }
        ),
    fileName: z
        .string({
            required_error: "file name is required",
            invalid_type_error: "invalid file name",
        })
        .min(1, "file name is required"),
    folderGroup: folderGroupSchema,
});
