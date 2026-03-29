import { z } from "zod";

export const DSchema = z.object({
    product: z.string().optional(),
    qr_code:z.number().optional(),
    isMetric: z.boolean(),
    x: z.number(),
    is_transfer: z.boolean().optional()
});

export type DFormType = z.infer<typeof DSchema>;
