import { z } from "zod";

export const BusketSchema = z.object({

  from: z.object({ value: z.string(), label: z.string() }),
  to:  z.object({ value: z.string(), label: z.string() }),
 
});

export type BusketSchemaType = z.infer<typeof BusketSchema>;
