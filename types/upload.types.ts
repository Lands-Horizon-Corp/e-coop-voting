import z from "zod";
import { folderGroupSchema } from "@/validation-schema/upload";

export type TFolderUploadGroups = z.infer<typeof folderGroupSchema>;

export type TUploadable = [
    buffer: Buffer,
    fileName: string,
    folderGroup: TFolderUploadGroups,
    fileType: string
];
