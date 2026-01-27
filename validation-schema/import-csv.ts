import z from "zod"


export const importCSVSchema = z.object({
    file : z.any().refine((file: File | undefined | null) => file !== undefined && file !== null, {
        message: "File is required",
        path: ["file"]
    }),
})
