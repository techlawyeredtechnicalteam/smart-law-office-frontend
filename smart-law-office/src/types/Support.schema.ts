import * as z from "zod";

export const supportFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  // .default("smartlaw@office.com"),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." })
});

export type SupportFormValues = z.infer<typeof supportFormSchema>;
