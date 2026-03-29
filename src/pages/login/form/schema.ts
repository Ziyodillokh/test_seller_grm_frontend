import { requiredStringField } from "@/utils/schemaHelper";
import { z } from "zod";

export const LoginSchema = z.object({
  login: requiredStringField(),
  password: z.string().optional(),
});

export type LoginFormType = z.infer<typeof LoginSchema>;
