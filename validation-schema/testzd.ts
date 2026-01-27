import z from "zod"

export const testdts = z.object({
    bday : z.string().datetime().refine((dt) => new Date(dt).toISOString())
})