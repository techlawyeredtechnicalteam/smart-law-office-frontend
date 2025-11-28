import { z } from "zod";

const SignUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { message: "Password must contain a letter." })
      .regex(/[0-9]/, { message: "Password must contain a number." }),
    confirmPassword: z.string(),
    firmId: z.string().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

const VerifySchema = z.object({
  code: z
    .string()
    .min(6, { message: "Code must be 6 digits." })
    .max(6, { message: "Code must be 6 digits." })
});

type SignUpFormData = z.infer<typeof SignUpSchema>;
type VerifyFormData = z.infer<typeof VerifySchema>;

export { SignUpSchema, VerifySchema };
export type { SignUpFormData, VerifyFormData };
