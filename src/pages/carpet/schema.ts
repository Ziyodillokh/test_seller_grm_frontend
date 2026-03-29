import { z } from "zod";

export const TSchema = z.object({
    count: z.number().optional(),
    y:z.number().optional(),
    check_count: z.number().optional(),
   
});

export type TFormType = z.infer<typeof TSchema>;
