import { z } from "zod";

export const ClientSchema = z.object({
  fullName: z.string().min(1, "Ism majburiy"),
  comment: z.string().optional(),
  address: z.string().min(1, "Manzil majburiy"),
  filialId: z.string(),
  phone: z.string().min(1, "Telefon majburiy"),
  userId: z.string(),
});

export type ClientFormType = z.infer<typeof ClientSchema>;
