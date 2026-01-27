import z from "zod";

export const eventPbBulkExportRequestSchema = z.object({
    batch: z.coerce.number(),
    dimension: z.coerce.number().min(100).max(1000).default(500).optional(),
    showPbNumberText: z.coerce.boolean().default(false).optional(),
});

export interface IEventPbBulkExportRequest
    extends z.infer<typeof eventPbBulkExportRequestSchema> {}

export interface IEventPbBulkExportResponse {
    url: string;
}
